package com.john.chat.service;

import org.springframework.data.mongodb.core.ChangeStreamEvent;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.john.chat.model.Message;
import com.john.chat.model.MessageType;
import com.mongodb.client.model.changestream.OperationType;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatChangeStreamListener {
    private final ReactiveMongoTemplate mongoTemplate;
    private final WebSocketSessionRegistry sessionRegistry;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        mongoTemplate.changeStream(Message.class)
            .listen()
            .subscribe(this::handleMessageChange);
    }

    private String toPayload(Message msg, MessageType type) {
        msg.setType(type);
        try {
            return objectMapper.writeValueAsString(msg);
        } catch (JsonProcessingException e) {
            return null;
        }
    }


    private void handleMessageChange(ChangeStreamEvent<Message> evt) {
        OperationType type = evt.getOperationType();
        switch (type) {
            case INSERT -> {
            	Message msg = evt.getBody();
                if (msg == null || msg.getRoomId() == null) return;
                broadcast(msg, MessageType.NEW);
            }
            case UPDATE, REPLACE -> {
            	Message msg = evt.getBody();
                if (msg == null || msg.getRoomId() == null) return;
                broadcast(msg, msg.isDeleted() ? MessageType.DELETE : MessageType.EDIT);
            }
            default -> {
                return;
            }
        }
    }

    private void broadcast(Message msg, MessageType type) {
        String payload = toPayload(msg, type);
        if (payload == null) return;
        sessionRegistry.sendToRoom(msg.getRoomId().toString(), payload);
    }
}
