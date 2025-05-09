package com.john.chat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.net.URI;
import java.util.List;

import com.john.chat.handler.ChatHandler;
import com.john.chat.model.Message;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.socket.HandshakeInfo;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.john.chat.jwt.JwtUtil;
import com.john.chat.model.ChatRoom;
import com.john.chat.repository.ChatRoomRepository;
import com.john.chat.repository.MessageRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class ChatHandlerTest {

    ChatHandler handler;
    MessageRepository messageRepo;
    ChatRoomRepository roomRepo;
    JwtUtil jwtUtil;
    ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        messageRepo = mock(MessageRepository.class);
        roomRepo = mock(ChatRoomRepository.class);
        jwtUtil = mock(JwtUtil.class);
        objectMapper = new ObjectMapper();
        handler = new ChatHandler(messageRepo, roomRepo, jwtUtil, objectMapper);
    }

    private WebSocketSession mockSession(String authHeader,
                                         String path,
                                         Flux<WebSocketMessage> receiveFlux,
                                         Mono<Void> sendMono) {
        WebSocketSession session = mock(WebSocketSession.class);

        HttpHeaders headers = new HttpHeaders();
        if (authHeader != null) {
            headers.add("Authorization", authHeader);
        }

        HandshakeInfo handshakeInfo = mock(HandshakeInfo.class);
        when(handshakeInfo.getUri()).thenReturn(URI.create("ws://localhost" + path));
        when(handshakeInfo.getHeaders()).thenReturn(headers);
        when(session.getHandshakeInfo()).thenReturn(handshakeInfo);

        when(session.receive()).thenReturn(receiveFlux);
        when(session.send(any())).thenReturn(sendMono);

        when(session.textMessage(any(String.class)))
                .thenAnswer(inv -> {
                    String payload = inv.getArgument(0);
                    WebSocketMessage msg = mock(WebSocketMessage.class);
                    when(msg.getPayloadAsText()).thenReturn(payload);
                    return msg;
                });

        return session;
    }

    private WebSocketMessage firstMessageFrom(Object publisher) {
        if (publisher instanceof Mono<?>) {
            @SuppressWarnings("unchecked")
            Mono<WebSocketMessage> mono = (Mono<WebSocketMessage>) publisher;
            return mono.block();
        }
        if (publisher instanceof Flux<?>) {
            @SuppressWarnings("unchecked")
            Flux<WebSocketMessage> flux = (Flux<WebSocketMessage>) publisher;
            return flux.blockFirst();
        }
        return null;
    }

    @Test
    void missingAuthorizationHeader() {
        WebSocketSession session = mockSession(
                null,
                "/chat/room/123",
                Flux.empty(),
                Mono.empty()
        );

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(publisher -> {
            WebSocketMessage first = firstMessageFrom(publisher);
            return first != null
                    && first.getPayloadAsText().contains("Missing or invalid Authorization header");
        }));
    }

    @Test
    void invalidToken() {
        WebSocketSession session = mockSession(
                "Bearer badtoken",
                "/chat/room/123",
                Flux.empty(),
                Mono.empty()
        );
        when(jwtUtil.validateToken("badtoken")).thenReturn(false);

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(publisher -> {
            WebSocketMessage first = firstMessageFrom(publisher);
            return first != null
                    && first.getPayloadAsText().contains("Invalid or expired token");
        }));
    }

    @Test
    void roomNotFound() {
        WebSocketSession session = mockSession(
                "Bearer good",
                "/chat/room/5f1d7f3e0e3a4d2b1c000001",
                Flux.empty(),
                Mono.empty()
        );
        when(jwtUtil.validateToken("good")).thenReturn(true);
        when(jwtUtil.getUsernameFromToken("good")).thenReturn("alice");
        when(roomRepo.findById(any(ObjectId.class))).thenReturn(Mono.empty());

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(publisher -> {
            WebSocketMessage first = firstMessageFrom(publisher);
            return first != null
                    && first.getPayloadAsText().contains("Chat room not found");
        }));
    }

    @Test
    void userNotMember() {
        WebSocketSession session = mockSession(
                "Bearer good",
                "/chat/room/5f1d7f3e0e3a4d2b1c000002",
                Flux.empty(),
                Mono.empty()
        );
        when(jwtUtil.validateToken("good")).thenReturn(true);
        when(jwtUtil.getUsernameFromToken("good")).thenReturn("bob");

        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId("5f1d7f3e0e3a4d2b1c000002"));
        room.setGroup(false);
        room.setMembers(List.of("alice", "charlie"));
        when(roomRepo.findById(new ObjectId("5f1d7f3e0e3a4d2b1c000002")))
                .thenReturn(Mono.just(room));

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(publisher -> {
            WebSocketMessage first = firstMessageFrom(publisher);
            return first != null
                    && first.getPayloadAsText().contains("You are not a member of this chat");
        }));
    }

    @Test
    void handlePrivate_successfulCase() {
        String token = "validToken";
        String username = "user1";
        String roomId = new ObjectId().toHexString();

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn(username);

        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId(roomId));
        room.setGroup(false);
        room.setMembers(List.of("user1", "user2"));
        when(roomRepo.findById(new ObjectId(roomId))).thenReturn(Mono.just(room));

        when(messageRepo.findAllByRoomId(new ObjectId(roomId))).thenReturn(Flux.empty());
        when(messageRepo.save(any(Message.class)))
                .thenAnswer(invocation -> Mono.just(invocation.getArgument(0)));

        WebSocketSession session = mock(WebSocketSession.class);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        HandshakeInfo info = new HandshakeInfo(
                URI.create("/chat/room/" + roomId),
                headers,
                Mono.empty(),
                null
        );

        when(session.getHandshakeInfo()).thenReturn(info);

        when(session.send(any())).thenReturn(Mono.empty());
        when(session.receive()).thenReturn(Flux.empty());

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(messageRepo).findAllByRoomId(new ObjectId(roomId));
        verify(session, never()).textMessage(startsWith("Error:"));
    }

    @Test
    void handleGroup_successfulCase() {
        String token = "validToken";
        String username = "user1";
        String roomId = new ObjectId().toHexString();

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn(username);

        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId(roomId));
        room.setGroup(true);
        room.setMembers(List.of("user1", "user2", "user3"));
        when(roomRepo.findById(new ObjectId(roomId))).thenReturn(Mono.just(room));

        when(messageRepo.findAllByRoomId(new ObjectId(roomId))).thenReturn(Flux.empty());
        when(messageRepo.save(any(Message.class)))
                .thenAnswer(invocation -> Mono.just(invocation.getArgument(0)));

        WebSocketSession session = mock(WebSocketSession.class);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        HandshakeInfo info = new HandshakeInfo(
                URI.create("/chat/room/" + roomId),
                headers,
                Mono.empty(),
                null
        );

        when(session.getHandshakeInfo()).thenReturn(info);
        when(session.send(any())).thenReturn(Mono.empty());

        WebSocketMessage incoming = mock(WebSocketMessage.class);
        when(incoming.getPayloadAsText()).thenReturn("{\"content\":\"hello\"}");
        when(session.receive()).thenReturn(Flux.just(incoming));

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(messageRepo).findAllByRoomId(new ObjectId(roomId));
        verify(session, never()).textMessage(startsWith("Error:"));

        verify(messageRepo).save(argThat(message ->
                message.getContent().equals("hello")
                        && message.getSender().equals(username)
                        && message.getRoomId().toHexString().equals(roomId)
        ));
    }

}
