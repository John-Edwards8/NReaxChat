package main.java.com.john.chat.repository;

import main.java.com.john.chat.model.ChatUser;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ChatUserRepository extends ReactiveMongoRepository<ChatUser, ObjectId> {
    Mono<ChatUser> findByUsername(String username);
}