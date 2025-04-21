package com.john.auth.repos;

import java.math.BigInteger;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.auth.model.User;
import reactor.core.publisher.Mono;

public interface AuthRepository extends ReactiveMongoRepository<User, BigInteger> {
	public Mono<User> findByUsername(String username);
}
