package com.john.protoChat.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
<<<<<<< Updated upstream:backend/ChatServer/src/main/java/com/john/protoChat/repository/MessageRepository.java
import com.john.protoChat.model.Message;

public interface MessageRepository extends ReactiveMongoRepository<Message, Long> {
=======
import com.john.chat.model.Message;
import reactor.core.publisher.Flux;

public interface MessageRepository extends ReactiveMongoRepository<Message, ObjectId> {
    Flux<Message> findAllByRoomId(ObjectId roomId);

>>>>>>> Stashed changes:backend/chat-service/src/main/java/com/john/chat/repository/MessageRepository.java
}
