package com.john.auth.handler;

import static org.springframework.http.MediaType.APPLICATION_JSON;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpCookie;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import com.john.auth.dto.AuthRequest;
import com.john.auth.dto.UserDTO;
import com.john.auth.dto.UserWithKeyDTO;
import com.john.auth.model.User;
import com.john.auth.repos.AuthRepository;
import com.john.auth.security.JwtUtil;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Used safely")
public class AuthHandler {
	private final AuthRepository repo;
	private final JwtUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;

	public Mono<ServerResponse> register(ServerRequest req) {
		return req.bodyToMono(AuthRequest.class)
				.flatMap(r -> createUser(r, "USER"))
				.flatMap(saved -> {
					return ServerResponse.ok()
							.contentType(APPLICATION_JSON)
							.bodyValue(saved);
				})
				.onErrorResume(e -> ServerResponse.badRequest().bodyValue(e.getMessage()));
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

							String host = req.uri().getHost();
							boolean isLocal = host != null && (host.equals("localhost") || host.equals("127.0.0.1"));

							ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", rt)
									.httpOnly(true)
									.secure(!isLocal)
									.path("/auth/api")
									.sameSite(isLocal ? "Strict" : "None")
									.maxAge(Duration.ofDays(7))
									.build();

							return ServerResponse.ok()
									.contentType(APPLICATION_JSON)
									.cookie(refreshCookie)
									.bodyValue(Map.of(
											"accessToken", at,
											"role", role,
											"username", u.getUsername()
									));
						})
				)
				.onErrorResume(e -> ServerResponse.status(401).bodyValue(e.getMessage()));
	}

	public Mono<ServerResponse> logout(ServerRequest req) {
		ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.path("/auth/api")
				.maxAge(Duration.ZERO)
				.build();
	
		return ServerResponse.noContent()
				.cookie(deleteCookie)
				.build();
	}

	public Mono<ServerResponse> refresh(ServerRequest request) {
		return Mono.justOrEmpty(request.cookies().getFirst("refreshToken"))
				.map(HttpCookie::getValue)
				.flatMap(refreshToken -> {
					if (!jwtUtil.validateToken(refreshToken, "refresh")) {
						return ServerResponse.status(401).bodyValue("Invalid refresh token");
					}
	
					String user = jwtUtil.getUsernameFromToken(refreshToken);
					String role = jwtUtil.getRoleFromToken(refreshToken);
					String newAccess = jwtUtil.generateAccessToken(user, role);
	
					return ServerResponse.ok()
							.contentType(APPLICATION_JSON)
							.bodyValue(Collections.singletonMap("accessToken", newAccess));
				})
				.switchIfEmpty(ServerResponse.badRequest().bodyValue("Missing refreshToken cookie"));
	}

	public Mono<ServerResponse> savePublicKey(ServerRequest request) {
		String rawHeader = request.headers().firstHeader("Authorization");
		if (rawHeader == null || !rawHeader.startsWith("Bearer ")) {
			return ServerResponse.status(401).bodyValue("Missing or invalid Authorization header");
		}
		String username = jwtUtil.getUsernameFromToken(rawHeader.substring(7));
		return request.bodyToMono(Map.class)
				.flatMap(body -> {
					String publicKey = (String) body.get("publicKey");
					return repo.findByUsername(username)
							.flatMap(user -> {
								user.setPublicKey(publicKey);
								return repo.save(user);
							});
				})
				.then(ServerResponse.ok().build());
	}

	private UserDTO toDTO(User u) {
		return new UserDTO(u.getUsername(), u.getRole());
	}

	public Mono<ServerResponse> getAllUsers(ServerRequest request) {
		Flux<UserDTO> all = repo.findAll()
				.map(this::toDTO);
		return ServerResponse.ok()
				.contentType(APPLICATION_JSON)
				.body(all, UserDTO.class);
	}

	public Mono<ServerResponse> getUser(ServerRequest request) {
		String username = request.pathVariable("username");
		return repo.findByUsername(username)
				.map(this::toDTO)
				.flatMap(user -> ServerResponse.ok()
						.contentType(APPLICATION_JSON)
						.bodyValue(user))
				.switchIfEmpty(ServerResponse.notFound().build());
	}

	public Mono<ServerResponse> getUserWithKey(ServerRequest request) {
		String username = request.pathVariable("username");
		return repo.findByUsername(username)
				.map(u -> new UserWithKeyDTO(u.getUsername(), u.getRole(), u.getPublicKey(), u.getPrivateKey()))
				.flatMap(user -> ServerResponse.ok()
						.contentType(APPLICATION_JSON)
						.bodyValue(user))
				.switchIfEmpty(ServerResponse.notFound().build());
	}

	public Mono<ServerResponse> getUserPublicKey(ServerRequest request) {
		String username = request.pathVariable("username");
		return repo.findByUsername(username)
				.map(user -> Map.of("publicKey", user.getPublicKey()))
				.flatMap(body -> ServerResponse.ok()
						.contentType(APPLICATION_JSON)
						.bodyValue(body))
				.switchIfEmpty(ServerResponse.notFound().build());
	}

	private Mono<User> createUser(AuthRequest req, String role) {
		return repo.findByUsername(req.getUsername())
				.flatMap(existing -> Mono.<User>error(new IllegalStateException("User exists")))
				.switchIfEmpty((Mono<? extends User>) Mono.defer(() -> {
					User user = User.builder()
									.username(req.getUsername())
									.password(passwordEncoder.encode(req.getPassword()))
									.role(role)
									.publicKey(req.getPublicKey())
									.privateKey(req.getPrivateKey())
									.build();
					return repo.save(user);
				}));
	}

	public Mono<ServerResponse> createAdmin(ServerRequest request) {
		return request.bodyToMono(AuthRequest.class)
				.flatMap(req -> createUser(req, "ADMIN"))
				.flatMap(saved -> {
					return ServerResponse.ok()
							.contentType(APPLICATION_JSON)
							.bodyValue(saved);
				})				
				.onErrorResume(e -> ServerResponse.badRequest().bodyValue(e.getMessage()));
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
							if(req.getPassword() != null) existingUser.setPassword(passwordEncoder.encode(req.getPassword()));

							return repo.save(existingUser);
						}))
				.map(this::toDTO)
				.flatMap(updatedUser ->
						ServerResponse.ok()
						.contentType(APPLICATION_JSON)
						.bodyValue(updatedUser))
				.switchIfEmpty(ServerResponse.notFound().build());
	}
}
