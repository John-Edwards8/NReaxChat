package com.john.chat.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.chat.model.Message;

public interface MessageRepository extends ReactiveMongoRepository<Message, ObjectId> {
}
