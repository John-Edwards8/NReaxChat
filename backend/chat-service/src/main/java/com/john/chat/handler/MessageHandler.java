package com.john.chat.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;

import com.john.chat.model.ChatMessage;
import com.john.chat.repository.MessageRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

//TODO: Sending messages
@Service
public class MessageHandler implements WebSocketHandler {
    @Autowired private MessageRepository messageRepository;

    public Mono<ServerResponse> getMessages(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAll(), ChatMessage.class);
    }
    @Override
    public Mono<Void> handle(WebSocketSession webSocketSession) {
        Flux<WebSocketMessage> stringFlux = webSocketSession.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .map(String::toUpperCase)
                .map(webSocketSession::textMessage);
        return webSocketSession.send(stringFlux);
    }

}
