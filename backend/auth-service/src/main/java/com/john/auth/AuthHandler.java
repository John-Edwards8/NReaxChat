package com.john.auth;

import com.john.auth.model.AuthRequest;
import com.john.auth.model.AuthResponse;
import com.john.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import com.john.auth.model.User;
import com.john.auth.repos.AuthRepository;
import reactor.core.publisher.Mono;

@Component
public class AuthHandler {

	private final AuthRepository repo;
	private final JwtUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	public AuthHandler(AuthRepository repo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
		this.repo = repo;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
	}

	public Mono<ServerResponse> register(ServerRequest request) {
		return request.bodyToMono(AuthRequest.class)
				.flatMap(req -> repo.findByUsername(req.getUsername())
						.flatMap(existing -> ServerResponse.badRequest().bodyValue("Username already exists"))
						.switchIfEmpty(Mono.defer(() -> {
							User user = new User();
							user.setUsername(req.getUsername());
							user.setPassword(passwordEncoder.encode(req.getPassword()));
							user.setRole("ROLE_USER");
							return repo.save(user)
									.flatMap(u -> {
										String token = jwtUtil.generateToken(u.getUsername(), u.getRole());
										return ServerResponse.ok()
												.contentType(MediaType.APPLICATION_JSON)
												.bodyValue(new AuthResponse(token, u.getRole()));
									});
						}))
				);
	}

	public Mono<ServerResponse> login(ServerRequest request) {
		return request.bodyToMono(AuthRequest.class)
				.flatMap(req -> repo.findByUsername(req.getUsername())
						.filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
						.switchIfEmpty(Mono.error(new RuntimeException("Invalid credentials")))
						.flatMap(u -> {
							String role = u.getRole();
							String token = jwtUtil.generateToken(u.getUsername(), role);
							return ServerResponse.ok()
									.contentType(MediaType.APPLICATION_JSON)
									.bodyValue(new AuthResponse(token, role));
						})
				)
				.onErrorResume(e -> ServerResponse.status(401).bodyValue(e.getMessage()));
	}
	
	public Mono<ServerResponse> getUser(ServerRequest request) {
		String uname = request.pathVariable("username");
		return repo.findByUsername(uname)
				.flatMap(user -> ServerResponse.ok()
						.contentType(MediaType.APPLICATION_JSON)
						.bodyValue(user))
				.switchIfEmpty(ServerResponse.notFound().build());
	}

	public Mono<ServerResponse> deleteUser(ServerRequest request) {
		String username = request.pathVariable("username");
		return repo.findByUsername(username)
				.flatMap(user ->
						repo.delete(user)
								.then(ServerResponse.noContent().build())
				)
				.switchIfEmpty(ServerResponse.notFound().build());
	}

	public Mono<ServerResponse> updateUser(ServerRequest request) {
		String username = request.pathVariable("username");
		return request.bodyToMono(AuthRequest.class)
				.flatMap(req -> repo.findByUsername(username)
						.flatMap(existingUser -> {
							existingUser.setPassword(passwordEncoder.encode(req.getPassword()));
							return repo.save(existingUser);
						})
						.flatMap(updatedUser ->
								ServerResponse.ok()
										.contentType(MediaType.APPLICATION_JSON)
										.bodyValue(updatedUser)
						)
				)
				.switchIfEmpty(ServerResponse.notFound().build());
	}
}
