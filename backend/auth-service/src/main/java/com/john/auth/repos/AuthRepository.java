package com.john.auth.repos;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.auth.model.User;
import reactor.core.publisher.Mono;

public interface AuthRepository extends ReactiveMongoRepository<User, ObjectId> {
	Mono<User> findByUsername(String username);
}