package com.john.protoChat.handler;

import com.john.protoChat.model.ChatMessage;
import com.john.protoChat.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class MessageHandler {

    @Autowired
    private ChatMessageService chatMessageService;

    // Отримання всіх повідомлень
    public Mono<ServerResponse> getMessages(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(chatMessageService.getMessages(), ChatMessage.class);
    }

    // Відправка нового повідомлення
    public Mono<ServerResponse> sendMessage(ServerRequest request) {
        Mono<ChatMessage> messageMono = request.bodyToMono(ChatMessage.class);
        return messageMono.flatMap(message ->
            chatMessageService.send(message)
                .flatMap(savedMessage -> 
                    ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(savedMessage) 
                )
        );
    }
}
