package com.john.protoChat.handler;

import com.john.protoChat.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import com.john.protoChat.repository.MessageRepository;

@Component
public class MessageHandler {
    @Autowired private MessageRepository messageRepository;

    public Mono<ServerResponse> getMessages(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAll(), ChatMessage.class);
    }
}
