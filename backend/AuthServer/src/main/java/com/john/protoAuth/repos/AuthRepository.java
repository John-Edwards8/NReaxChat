package com.john.protoAuth.repos;

import java.math.BigInteger;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import com.john.protoAuth.model.User;
import reactor.core.publisher.Mono;

public interface AuthRepository extends ReactiveMongoRepository<User, BigInteger> {
	public Mono<User> findByUsername(String username);
}
