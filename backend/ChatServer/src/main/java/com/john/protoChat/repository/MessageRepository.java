package com.john.protoChat.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.protoChat.model.Message;

public interface MessageRepository extends ReactiveMongoRepository<Message, ObjectId> {
}
