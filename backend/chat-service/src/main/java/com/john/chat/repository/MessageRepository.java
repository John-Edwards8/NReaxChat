package com.john.chat.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.chat.model.Message;

import reactor.core.publisher.Flux;

public interface MessageRepository extends ReactiveMongoRepository<Message, ObjectId> {
    Flux<Message> findAllByRoomId(ObjectId roomId);

}
