package com.john.chat.handler;

<<<<<<< HEAD
import org.bson.types.ObjectId;
=======
>>>>>>> dev
import org.springframework.beans.factory.annotation.Autowired;
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

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MessageHandler implements WebSocketHandler {
    @Autowired private MessageRepository messageRepository;
    @Autowired private ObjectMapper objectMapper;
    public Mono<ServerResponse> getMessages(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAll(), ChatMessage.class);
    }
    @Override
    public Mono<Void> handle(WebSocketSession webSocketSession) {
        Flux<WebSocketMessage> incomingMessages = webSocketSession.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(raw -> {
                    try {
                        Message mess = objectMapper.readValue(raw, Message.class);
                        return messageRepository.save(mess)
                                                .thenReturn(mess);
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
        return webSocketSession.send(incomingMessages);
    }
<<<<<<< HEAD
    public Mono<ServerResponse> getMessagesByRoomId(ServerRequest request) {
        String roomId = request.pathVariable("roomId");
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(messageRepository.findAllByRoomId(new ObjectId(roomId)), Message.class);
    }
=======
>>>>>>> dev

}
