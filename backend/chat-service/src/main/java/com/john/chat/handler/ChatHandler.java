package com.john.chat.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.john.chat.jwt.JwtUtil;
import com.john.chat.model.Message;
import com.john.chat.repository.ChatRoomRepository;
import com.john.chat.repository.MessageRepository;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@AllArgsConstructor
public class ChatHandler implements WebSocketHandler {

    private final MessageRepository messageRepo;
    private final ChatRoomRepository roomRepo;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final Map<String, Sinks.Many<Message>> sinks = new ConcurrentHashMap<>();

    @Override
    @NonNull
    public Mono<Void> handle(WebSocketSession session) {
        String auth = session.getHandshakeInfo().getHeaders().getFirst("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return session.send(Mono.just(session.textMessage("Missing or invalid Authorization header"))).then();
        }

        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return session.send(Mono.just(session.textMessage("Invalid or expired token"))).then();
        }

        String username = jwtUtil.getUsernameFromToken(token);

        String path = session.getHandshakeInfo().getUri().getPath();
        String roomId = path.substring(path.lastIndexOf('/') + 1);

        return roomRepo.findById(new ObjectId(roomId))
                .switchIfEmpty(Mono.error(new AccessDeniedException("Chat room not found")))
                .flatMap(room -> {
                    if (!room.isGroup()) {
                        if (room.getMembers() == null || room.getMembers().size() != 2) {
                            return Mono.error(new IllegalStateException(
                                    "Invalid private chat configuration: must have exactly 2 members"));
                        }
                    } else if (room.getMembers() == null || room.getMembers().size() < 3) {
                        return Mono.error(new IllegalStateException(
                                "Invalid group chat configuration: need at least 3 members"));
                    }

                    if (room.getMembers().stream().noneMatch(username::equals)) {
                        return Mono.error(new AccessDeniedException("You are not a member of this chat"));
                    }

                    Sinks.Many<Message> sink = sinks.computeIfAbsent(roomId,
                            id -> Sinks.many().multicast().directAllOrNothing());

                    Flux<WebSocketMessage> toClient = Flux.concat(
                            messageRepo.findAllByRoomId(new ObjectId(roomId))
                                    .map(this::toJsonText)
                                    .map(session::textMessage),
                            sink.asFlux()
                                    .map(this::toJsonText)
                                    .map(session::textMessage)
                    );

                    Mono<Void> send = session.send(toClient);

                    Mono<Void> receive = session.receive()
                            .map(WebSocketMessage::getPayloadAsText)
                            .flatMap(raw -> {
                                try {
                                    Message msg = objectMapper.readValue(raw, Message.class);
                                    msg.setRoomId(new ObjectId(roomId));
                                    msg.setTimestamp(LocalDateTime.now());
                                    msg.setSender(username);
                                    return messageRepo.save(msg)
                                            .doOnNext(sink::tryEmitNext)
                                            .then();
                                } catch (JsonProcessingException e) {
                                    return Mono.empty();
                                }
                            })
                            .then();

                    return Mono.when(send, receive);
                })
                .onErrorResume(ex ->
                        session.send(Mono.just(session.textMessage("Error: " + ex.getMessage()))).then()
                );
    }

    private String toJsonText(Message msg) {
        try {
            return objectMapper.writeValueAsString(msg);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}