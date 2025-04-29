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

import java.util.Collections;

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

	public Mono<ServerResponse> register(ServerRequest req) {
		return req.bodyToMono(AuthRequest.class)
				.flatMap(r -> repo.findByUsername(r.getUsername())
						.flatMap(u -> ServerResponse.badRequest().bodyValue("Exists"))
						.switchIfEmpty(Mono.defer(() -> {
							User u = new User();
							u.setUsername(r.getUsername());
							u.setPassword(passwordEncoder.encode(r.getPassword()));
							u.setRole("ROLE_USER");
							return repo.save(u)
									.flatMap(saved -> {
										String role = saved.getRole();
										String at = jwtUtil.generateAccessToken(saved.getUsername(), role);
										String rt = jwtUtil.generateRefreshToken(saved.getUsername(), role);
										return ServerResponse.ok()
												.contentType(MediaType.APPLICATION_JSON)
												.bodyValue(new AuthResponse(at, rt, role));
									});
						}))
				);
	}

	public Mono<ServerResponse> login(ServerRequest req) {
		return req.bodyToMono(AuthRequest.class)
				.flatMap(r -> repo.findByUsername(r.getUsername())
						.filter(u -> passwordEncoder.matches(r.getPassword(), u.getPassword()))
						.switchIfEmpty(Mono.error(new RuntimeException("Invalid credentials")))
						.flatMap(u -> {
							String role = u.getRole();
							String at = jwtUtil.generateAccessToken(u.getUsername(), role);
							String rt = jwtUtil.generateRefreshToken(u.getUsername(), role);
							return ServerResponse.ok()
									.contentType(MediaType.APPLICATION_JSON)
									.bodyValue(new AuthResponse(at, rt, role));
						})
				)
				.onErrorResume(e -> ServerResponse.status(401).bodyValue(e.getMessage()));
	}

	public Mono<ServerResponse> refresh(ServerRequest req) {
		return Mono.justOrEmpty(req.headers().firstHeader("Authorization"))
				.filter(h -> h.startsWith("Bearer "))
				.map(h -> h.substring(7))
				.flatMap(refreshToken -> {
					if (!jwtUtil.validateToken(refreshToken, "refresh")) {
						return ServerResponse.status(401).bodyValue("Invalid refresh token");
					}

					String user = jwtUtil.getUsernameFromToken(refreshToken);
					String role = jwtUtil.getRoleFromToken(refreshToken);
					String newAccess = jwtUtil.generateAccessToken(user, role);

					return ServerResponse.ok()
							.contentType(MediaType.APPLICATION_JSON)
							.bodyValue(Collections.singletonMap("accessToken", newAccess));
				})
				.switchIfEmpty(ServerResponse.badRequest().bodyValue("Missing or invalid Authorization header"));
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
