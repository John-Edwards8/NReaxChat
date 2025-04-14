package com.john.protoAuth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ContextConfiguration;

import com.john.protoAuth.model.User;
import com.john.protoAuth.repos.AuthRepository;
import reactor.test.StepVerifier;
import reactor.core.publisher.Flux;

@ContextConfiguration
@DataMongoTest
public class RepositoryTests {
    @Autowired private AuthRepository repository;
	
	@Test
    void shouldFindNothing() {
        Flux<User> users = repository.findAll();

        users.as(StepVerifier::create)
	        .expectNextCount(0)
	        .verifyComplete();
    }
	
	@Test
    void shouldFindMonoUser() {
		String name = "Vasya";
		User user = User.builder().username("Vasya").password("password").build();
		
		repository.save(user)
		        .then(repository.findByUsername(name))
		        .as(StepVerifier::create)
		        .expectNext(user)
		        .verifyComplete();
    }
	
	@Test
    void shouldDropMonoUser() {
		String name = "Vasya";
		
		repository.delete(repository.findByUsername(name).block())
		        .then(repository.findByUsername(name))
		        .as(StepVerifier::create)
		        .verifyComplete();
    }
	
}
