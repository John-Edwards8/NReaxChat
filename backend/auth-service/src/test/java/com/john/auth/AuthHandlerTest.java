package com.john.auth;

import com.john.auth.config.TestConfig;
import com.john.auth.dto.UserDTO;
import com.john.auth.handler.AuthHandler;
import com.john.auth.dto.AuthRequest;
import com.john.auth.dto.AuthResponse;
import com.john.auth.model.User;
import com.john.auth.repos.AuthRepository;
import com.john.auth.router.AuthRouter;
import com.john.auth.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@WebFluxTest
@Import({AuthHandler.class, AuthRouter.class, TestConfig.class})
class AuthHandlerTest {

    WebTestClient client;
    AuthRepository repository;
    JwtUtil jwtUtil;
    PasswordEncoder passwordEncoder;

    @Autowired
    public AuthHandlerTest(AuthRepository repository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @BeforeEach
    void setup() {
        AuthHandler handler = new AuthHandler(repository, jwtUtil, passwordEncoder);
        client = WebTestClient.bindToRouterFunction(
                new AuthRouter().route(handler)
        ).build();
    }

    @Test
    void register_shouldReturnAccessAndRefreshTokens_whenNewUser() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u1");
        req.setPassword("p1");

        when(repository.findByUsername("u1")).thenReturn(Mono.empty());
        when(passwordEncoder.encode("p1")).thenReturn("hashed");
        User saved = new User(null, "u1", "hashed", "USER");
        when(repository.save(any(User.class))).thenReturn(Mono.just(saved));
        when(jwtUtil.generateAccessToken("u1", "USER")).thenReturn("accessTok");
        when(jwtUtil.generateRefreshToken("u1", "USER")).thenReturn("refreshTok");

        client.post().uri("/api/register")
                .contentType(APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthResponse.class)
                .value(r -> {
                    assertThat(r.getAccessToken()).isEqualTo("accessTok");
                    assertThat(r.getRefreshToken()).isEqualTo("refreshTok");
                    assertThat(r.getRole()).isEqualTo("USER");
                });
    }

    @Test
    void login_shouldReturn401_whenBadCredentials() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u2");
        req.setPassword("pw");

        when(repository.findByUsername("u2")).thenReturn(Mono.just(new User(null, "u2", "wrongHash", "USER")));
        when(passwordEncoder.matches("pw", "wrongHash")).thenReturn(false);

        client.post().uri("/api/login")
                .contentType(APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void login_shouldReturnAccessAndRefresh_whenGoodCredentials() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u3"); req.setPassword("pw");
        User user = new User(null, "u3", "hash3", "USER");
        when(repository.findByUsername("u3")).thenReturn(Mono.just(user));
        when(passwordEncoder.matches("pw", "hash3")).thenReturn(true);
        when(jwtUtil.generateAccessToken("u3", "USER")).thenReturn("access3");
        when(jwtUtil.generateRefreshToken("u3", "USER")).thenReturn("refresh3");

        client.post().uri("/api/login")
                .contentType(APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthResponse.class)
                .value(r -> {
                    assertThat(r.getAccessToken()).isEqualTo("access3");
                    assertThat(r.getRefreshToken()).isEqualTo("refresh3");
                    assertThat(r.getRole()).isEqualTo("USER");
                });
    }

    @Test
    void getAllUsers_shouldReturnListOfUserDTOs() {
        User u1 = new User(BigInteger.valueOf(1), "alice", "hash", "ROLE_USER");
        User u2 = new User(BigInteger.valueOf(2), "bob",   "hash", "ROLE_ADMIN");
        UserDTO d1 = new UserDTO(u1.getId(), u1.getUsername(), u1.getRole());
        UserDTO d2 = new UserDTO(u2.getId(), u2.getUsername(), u2.getRole());

        when(repository.findAll()).thenReturn(Flux.just(u1, u2));

        client.get().uri("/api/users")
                .accept(APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(UserDTO.class)
                .hasSize(2)
                .value(list -> {
                    assertThat(list).containsExactly(d1, d2);
                });
    }

    @Test
    void getUser_shouldReturnUser_whenExists() {
        when(repository.findByUsername("zz")).thenReturn(Mono.just(new User(null, "zz", "h", "USER")));

        client.get().uri("/api/users/zz")
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getUsername()).isEqualTo("zz"));
    }

    @Test
    void getUser_shouldReturn404_whenNotFound() {
        when(repository.findByUsername("xx")).thenReturn(Mono.empty());

        client.get().uri("/api/users/xx")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void updateUser_shouldReturnUpdatedUserWithoutPassword_whenValid() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u4");
        req.setPassword("newpw");
        User existing = new User(null, "u4", "oldhash", "ROLE_USER");
        User updated = new User(null, "u4", "newhash", "ROLE_USER");

        when(repository.findByUsername("u4")).thenReturn(Mono.just(existing));
        when(passwordEncoder.encode("newpw")).thenReturn("newhash");
        when(repository.save(any(User.class))).thenReturn(Mono.just(updated));

        client.put().uri("/api/users/u4")
                .contentType(APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> {
                    assertThat(u.getUsername()).isEqualTo("u4");
                    assertThat(u.getRole()).isEqualTo("ROLE_USER");
                    assertThat(u.getPassword()).isNull();
                });
    }

    @Test
    void deleteUser_shouldReturnNoContent_whenExists() {
        User existing = new User(null, "u5", "h", "USER");
        when(repository.findByUsername("u5")).thenReturn(Mono.just(existing));
        when(repository.delete(existing)).thenReturn(Mono.empty());

        client.delete().uri("/api/users/u5")
                .exchange()
                .expectStatus().isNoContent();
    }

    @Test
    void deleteUser_shouldReturnNotFound_whenMissing() {
        when(repository.findByUsername("none")).thenReturn(Mono.empty());

        client.delete().uri("/api/users/none")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void refresh_shouldReturnNewAccessToken_whenValidRefresh() {
        String refreshToken = "validRefresh";
        Mockito.when(jwtUtil.validateToken(refreshToken, "refresh")).thenReturn(true);
        Mockito.when(jwtUtil.getUsernameFromToken(refreshToken)).thenReturn("u1");
        Mockito.when(jwtUtil.getRoleFromToken(refreshToken)).thenReturn("USER");
        Mockito.when(jwtUtil.generateAccessToken("u1", "USER")).thenReturn("newAccess");

        client.post().uri("/api/refresh")
                .header("Authorization", "Bearer " + refreshToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.accessToken").isEqualTo("newAccess");
    }

    @Test
    void refresh_shouldReturn401_whenInvalidRefresh() {
        String badRefresh = "badRefresh";
        Mockito.when(jwtUtil.validateToken(badRefresh, "refresh")).thenReturn(false);

        client.post().uri("/api/refresh")
                .header("Authorization", "Bearer " + badRefresh)
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void refresh_shouldReturn400_whenNoHeader() {
        client.post().uri("/api/refresh")
                .exchange()
                .expectStatus().isBadRequest();
    }
}