package com.john.chat.service;

import java.util.Collection;
import java.util.Map;
import org.bson.BsonDocument;
import org.bson.BsonObjectId;
import org.springframework.data.mongodb.core.ChangeStreamEvent;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketSession;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.john.chat.model.Message;
import com.mongodb.client.model.changestream.OperationType;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

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

    private String createPayload(String type, Object data) {
        ObjectNode json = objectMapper.createObjectNode();
        json.put("type", type);
        json.set("data", objectMapper.valueToTree(data));
        try {
            return objectMapper.writeValueAsString(json);
        } catch (JsonProcessingException e) {
            return "{\"type\":\"error\",\"data\":\"serialization failed\"}";
        }
    }


    private void handleMessageChange(ChangeStreamEvent<Message> evt) {
        OperationType type = evt.getOperationType();
        String payload;
        String roomId;

        switch (type) {
            case INSERT -> {
                Message msg = evt.getBody();
                roomId = msg.getRoomId().toString();
                payload = createPayload("insert", msg);
                sendToRoom(roomId, payload);
            }
            case UPDATE, REPLACE -> {
                Message msg = evt.getBody();
                if (msg == null) return;
                roomId = msg.getRoomId().toString();
                payload = createPayload("update", msg);
                sendToRoom(roomId, payload);
            }
            case DELETE -> {
                BsonDocument docKey = evt.getRaw().getDocumentKey();
                if (docKey == null || !docKey.containsKey("_id")) return;

                BsonObjectId bsonId = docKey.getObjectId("_id");
                String deletedId = bsonId.getValue().toHexString();

                mongoTemplate.findById(deletedId, Message.class)
                    .flatMap(deletedMessage -> {
                        String resolvedRoomId = deletedMessage.getRoomId().toHexString();
                        String deletePayload = createPayload("delete", Map.of("id", deletedId));
                        sendToRoom(resolvedRoomId, deletePayload);
                        return Mono.empty();
                    })
                    .subscribe();

                return;
            }
            default -> {
                return;
            }
        }
    }

    private void sendToRoom(String roomId, String payload) {
        Collection<WebSocketSession> sessions = sessionRegistry.getSessionsForRoom(roomId);
        for (WebSocketSession session : sessions) {
            session.send(Mono.just(session.textMessage(payload))).subscribe();
        }
    }
}
