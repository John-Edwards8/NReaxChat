package com.john.chat;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.net.URI;
import java.util.List;

import com.john.chat.handler.ChatHandler;
import com.john.chat.model.Message;
import com.john.chat.repository.ChatRoomRepository;
import com.john.chat.repository.MessageRepository;
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

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class ChatHandlerTest {

    private ChatHandler handler;
    private MessageRepository messageRepo;
    private ChatRoomRepository roomRepo;
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        messageRepo = mock(MessageRepository.class);
        roomRepo = mock(ChatRoomRepository.class);
        jwtUtil = mock(JwtUtil.class);
        ObjectMapper objectMapper = new ObjectMapper();
        handler = new ChatHandler(messageRepo, roomRepo, jwtUtil, objectMapper);
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

    private WebSocketSession mockSession(String path,
                                         Flux<WebSocketMessage> receiveFlux,
                                         Mono<Void> sendMono,
                                         HttpHeaders headers) {
        WebSocketSession session = mock(WebSocketSession.class);

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

    @Test
    void missingToken() {
        HttpHeaders headers = new HttpHeaders();
        WebSocketSession session = mockSession(
                "/chat/room/any",
                Flux.empty(),
                Mono.empty(),
                headers
        );

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(pub -> {
            WebSocketMessage m = firstMessageFrom(pub);
            return m != null && m.getPayloadAsText().contains("Invalid token");
        }));
    }

    @Test
    void roomNotFound() {
        String token = "t";
        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("alice");

        HttpHeaders headers = new HttpHeaders();
        String goodId = "000000000000000000000123";
        WebSocketSession session = mockSession(
                "/chat/room/" + goodId + "?token=" + token,
                Flux.empty(),
                Mono.empty(),
                headers
        );

        when(roomRepo.findById(new ObjectId(goodId)))
                .thenReturn(Mono.empty());

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(pub -> {
            WebSocketMessage m = firstMessageFrom(pub);
            return m != null && m.getPayloadAsText().contains("Chat room not found");
        }));
    }

    @Test
    void userNotMember() {
        String token = "tok";
        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("bob");

        String goodId = "5f1d7f3e0e3a4d2b1c000002";
        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId(goodId));
        room.setMembers(List.of("alice", "charlie"));
        when(roomRepo.findById(new ObjectId(goodId)))
                .thenReturn(Mono.just(room));

        WebSocketSession session = mockSession(
                "/chat/room/" + goodId + "?token=" + token,
                Flux.empty(),
                Mono.empty(),
                new HttpHeaders()
        );

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(session).send(argThat(pub -> {
            WebSocketMessage m = firstMessageFrom(pub);
            return m != null && m.getPayloadAsText().contains("No access");
        }));
    }

    @Test
    void handlePrivate_successfulCase() {
        String token = "good";
        String user = "user1";
        String roomId = new ObjectId().toHexString();

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn(user);

        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId(roomId));
        room.setMembers(List.of("user1", "user2"));
        when(roomRepo.findById(new ObjectId(roomId))).thenReturn(Mono.just(room));

        when(messageRepo.findAllByRoomId(new ObjectId(roomId))).thenReturn(Flux.empty());
        when(messageRepo.save(any(Message.class)))
                .thenAnswer(inv -> Mono.just(inv.getArgument(0)));

        WebSocketSession session = mockSession(
                "/chat/room/" + roomId + "?token=" + token,
                Flux.empty(),
                Mono.empty(),
                new HttpHeaders()
        );

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(messageRepo).findAllByRoomId(new ObjectId(roomId));
        verify(session, never()).textMessage(startsWith("Error:"));
    }

    @Test
    void handleGroup_successfulCase() {
        String token = "good";
        String user = "user1";
        String roomId = new ObjectId().toHexString();

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn(user);

        ChatRoom room = new ChatRoom();
        room.setId(new ObjectId(roomId));
        room.setMembers(List.of("user1","user2","user3"));
        when(roomRepo.findById(new ObjectId(roomId))).thenReturn(Mono.just(room));

        when(messageRepo.findAllByRoomId(new ObjectId(roomId))).thenReturn(Flux.empty());
        when(messageRepo.save(any(Message.class)))
                .thenAnswer(inv -> Mono.just(inv.getArgument(0)));

        WebSocketMessage incoming = mock(WebSocketMessage.class);
        when(incoming.getPayloadAsText()).thenReturn("{\"content\":\"hello\"}");

        WebSocketSession session = mockSession(
                "/chat/room/" + roomId + "?token=" + token,
                Flux.just(incoming),
                Mono.empty(),
                new HttpHeaders()
        );

        StepVerifier.create(handler.handle(session))
                .verifyComplete();

        verify(messageRepo).findAllByRoomId(new ObjectId(roomId));
        verify(messageRepo).save(argThat(msg ->
                "hello".equals(msg.getContent())
                        && user.equals(msg.getSender())
                        && roomId.equals(msg.getRoomId().toHexString())
        ));
        verify(session, never()).textMessage(startsWith("Error:"));
    }
}
