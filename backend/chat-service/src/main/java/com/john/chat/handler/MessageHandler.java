package com.john.chat.handler;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.john.chat.model.ChatMessage;
import com.john.chat.model.Message;
import com.john.chat.repository.MessageRepository;
import com.john.chat.service.WebSocketSessionRegistry;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class MessageHandler implements WebSocketHandler {
    @Autowired private MessageRepository messageRepository;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private WebSocketSessionRegistry sessionRegistry;

    public Mono<ServerResponse> getMessages(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAll(), ChatMessage.class);
    }
    @Override
    public Mono<Void> handle(WebSocketSession webSocketSession) {
        String roomId = webSocketSession.getHandshakeInfo().getUri().getQuery().split("=")[1];

        sessionRegistry.register(roomId, webSocketSession);

        Flux<WebSocketMessage> incoming = webSocketSession.receive()
            .map(WebSocketMessage::getPayloadAsText)
            .flatMap(raw -> {
                try {
                    Message mess = objectMapper.readValue(raw, Message.class);
                    return messageRepository.save(mess).thenReturn(mess);
                } catch (Exception e) {
                    return Mono.empty();
                }
            })
            .map(savedMessage -> {
                try {
                    String json = objectMapper.writeValueAsString(savedMessage);
                    return webSocketSession.textMessage(json);
                } catch (Exception e) {
                    return webSocketSession.textMessage("Invalid format");
                }
            });
        return webSocketSession.send(incoming)
                .doFinally(sig -> sessionRegistry.unregister(webSocketSession));
    }

    public Mono<ServerResponse> getMessagesByRoomId(ServerRequest request) {
        String roomId = request.pathVariable("roomId");
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAllByRoomId(new ObjectId(roomId)), Message.class);
    }

    public Mono<ServerResponse> updateMessage(ServerRequest request) {
        String id = request.pathVariable("id");

        Mono<Map<String, Object>> changesMono = request.bodyToMono(new ParameterizedTypeReference<>() {});

        return messageRepository.findById(new ObjectId(id))
                .flatMap(existingMessage ->
                        changesMono.flatMap(map -> {
                            if (map.containsKey("content")) {
                                Object raw = map.get("content");
                                if (raw instanceof String) {
                                    existingMessage.setContent((String) raw);
                                }
                            }

                            return messageRepository.save(existingMessage);
                        })
                )
                .flatMap(updated -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(updated)
                )
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> deleteMessage(ServerRequest request) {
        String id = request.pathVariable("id");

        return messageRepository.findById(new ObjectId(id))
                .flatMap(existing ->
                        messageRepository.delete(existing)
                                .then(ServerResponse.noContent().build())
                )
                .switchIfEmpty(ServerResponse.notFound().build());
    }
}
