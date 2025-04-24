package com.john.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import com.john.auth.model.User;
import com.john.auth.repos.AuthRepository;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@DataMongoTest
class RepositoryTest {

	@Autowired
	private AuthRepository repository;

	private final User testUser = User.builder()
			.username("username")
			.password("password")
			.build();

	@BeforeEach
	void cleanDatabase() {
		repository.deleteAll().block();
	}

	@Test
	void shouldFindNoUsersWhenEmpty() {
		StepVerifier.create(repository.findAll())
				.expectNextCount(0)
				.verifyComplete();
	}

	@Test
	void shouldSaveAndFindByUsername() {
		Mono<User> op = repository.save(testUser)
				.then(repository.findByUsername(testUser.getUsername()));

		StepVerifier.create(op)
				.expectNextMatches(user ->
						user.getUsername().equals(testUser.getUsername()) &&
								user.getPassword().equals(testUser.getPassword())
				)
				.verifyComplete();
	}

	@Test
	void shouldReturnEmptyWhenUsernameNotFound() {
		StepVerifier.create(repository.findByUsername("unknown"))
				.verifyComplete();
	}

	@Test
	void shouldDeleteUserCorrectly() {
		Mono<Void> op = repository.save(testUser)
				.flatMap(u -> repository.delete(u))
				.then();
		StepVerifier.create(op).verifyComplete();

		StepVerifier.create(repository.findByUsername(testUser.getUsername()))
				.verifyComplete();
	}

	@Test
	void shouldFindAllMultipleUsers() {
		User u1 = User.builder().username("A").password("p").build();
		User u2 = User.builder().username("B").password("q").build();

		StepVerifier.create(
						repository.saveAll(Mono.just(u1).concatWith(Mono.just(u2))).thenMany(repository.findAll())
				)
				.expectNextCount(2)
				.verifyComplete();
	}
}
