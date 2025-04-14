package com.john.protoAuth;

import java.math.BigInteger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import com.john.protoAuth.model.User;
import com.john.protoAuth.repos.AuthRepository;
import reactor.core.publisher.Mono;

@Component
public class AuthHandler {
	@Autowired
	private AuthRepository repo;
	public Mono<ServerResponse> hello(ServerRequest request) {
	    return ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
	    	  .body(BodyInserters.fromValue(new User(BigInteger.ONE, "Hello, Spring!", "How are u?")));
	}
	
	public Mono<ServerResponse> getUser(ServerRequest request) {
		String uname = request.pathVariable("username");
		return repo.findByUsername(uname)
				.flatMap(user -> ServerResponse.ok()
								.contentType(MediaType.APPLICATION_JSON)
								.bodyValue(user))
				.switchIfEmpty(ServerResponse.notFound().build());
	}
	
	public Mono<ServerResponse> createUser(ServerRequest request) {
		return request.bodyToMono(User.class)
				.flatMap(repo::save)
				.flatMap(user ->ServerResponse.ok()
								.contentType(MediaType.APPLICATION_JSON)
								.bodyValue(user))
				.onErrorResume(e -> ServerResponse.badRequest().bodyValue("Server error: " + e.getMessage()));
	}
	
	public Mono<ServerResponse> deleteUser(ServerRequest request) {
		return repo.findByUsername(request.pathVariable("del"))
				.flatMap(user -> repo.delete(user))
					.then(ServerResponse.noContent().build())
				.switchIfEmpty(ServerResponse.notFound().build());
	}
	
	public Mono<ServerResponse> updateUser(ServerRequest request) {
		return request.bodyToMono(User.class)
				.flatMap(newData -> repo.findByUsername(request.pathVariable("upd"))
					.flatMap(existingUser -> {
						existingUser.setPassword(newData.getPassword());
						return repo.save(existingUser);
					})
					.flatMap(updatedUser -> ServerResponse.ok()
							.contentType(MediaType.APPLICATION_JSON)
							.bodyValue(updatedUser))
				)
				.switchIfEmpty(ServerResponse.notFound().build());
	}
}
