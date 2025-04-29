package com.john.auth;

import com.john.auth.config.TestConfig;
import com.john.auth.model.AuthRequest;
import com.john.auth.model.AuthResponse;
import com.john.auth.model.User;
import com.john.auth.repos.AuthRepository;
import com.john.auth.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

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
    void register_shouldReturnTokenAndRole_whenNewUser() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u1");
        req.setPassword("p1");

        Mockito.when(repository.findByUsername("u1")).thenReturn(Mono.empty());
        Mockito.when(passwordEncoder.encode("p1")).thenReturn("hashed");
        User saved = new User(null, "u1", "hashed", "ROLE_USER");
        Mockito.when(repository.save(any(User.class))).thenReturn(Mono.just(saved));
        Mockito.when(jwtUtil.generateToken("u1", "ROLE_USER")).thenReturn("tok");

        client.post().uri("/register")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthResponse.class)
                .value(r -> {
                    assertThat(r.getToken()).isEqualTo("tok");
                    assertThat(r.getRole()).isEqualTo("ROLE_USER");
                });
    }

    @Test
    void login_shouldReturn401_whenBadCredentials() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u2");
        req.setPassword("pw");

        Mockito.when(repository.findByUsername("u2")).thenReturn(Mono.just(new User(null, "u2", "wrongHash", null)));
        Mockito.when(passwordEncoder.matches("pw", "wrongHash")).thenReturn(false);

        client.post().uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    void login_shouldReturnTokenAndRole_whenGoodCredentials() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u3");
        req.setPassword("pw");

        Mockito.when(repository.findByUsername("u3"))
                .thenReturn(Mono.just(new User(null, "u3", "hash3", "ROLE_USER")));
        Mockito.when(jwtUtil.generateToken("u3", "ROLE_USER"))
                .thenReturn("tok3");
        Mockito.when(passwordEncoder.matches("pw", "hash3")).thenReturn(true);

        client.post().uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(AuthResponse.class)
                .value(r -> {
                    assertThat(r.getToken()).isEqualTo("tok3");
                    assertThat(r.getRole()).isEqualTo("ROLE_USER");
                });
    }

    @Test
    void getUser_shouldReturnUser_whenExists() {
        Mockito.when(repository.findByUsername("zz")).thenReturn(Mono.just(new User(null, "zz", "h", "ROLE_USER")));

        client.get().uri("/user/zz")
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getUsername()).isEqualTo("zz"));
    }

    @Test
    void getUser_shouldReturn404_whenNotFound() {
        Mockito.when(repository.findByUsername("xx")).thenReturn(Mono.empty());

        client.get().uri("/user/xx")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void updateUser_shouldUpdatePassword_whenValid() {
        AuthRequest req = new AuthRequest();
        req.setUsername("u4");
        req.setPassword("newpw");
        User existing = new User(null, "u4", "oldhash", "ROLE_USER");
        User updated = new User(null, "u4", "newhash", "ROLE_USER");

        Mockito.when(repository.findByUsername("u4")).thenReturn(Mono.just(existing));
        Mockito.when(passwordEncoder.encode("newpw")).thenReturn("newhash");
        Mockito.when(repository.save(any(User.class))).thenReturn(Mono.just(updated));

        client.put().uri("/updateUser/u4")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody(User.class)
                .value(u -> assertThat(u.getPassword()).isEqualTo("newhash"));
    }

    @Test
    void deleteUser_shouldReturnNoContent_whenExists() {
        User existing = new User(null, "u5", "h", "ROLE_USER");
        Mockito.when(repository.findByUsername("u5")).thenReturn(Mono.just(existing));
        Mockito.when(repository.delete(existing)).thenReturn(Mono.empty());

        client.delete().uri("/deleteUser/u5")
                .exchange()
                .expectStatus().isNoContent();
    }

    @Test
    void deleteUser_shouldReturnNotFound_whenMissing() {
        Mockito.when(repository.findByUsername("none")).thenReturn(Mono.empty());

        client.delete().uri("/deleteUser/none")
                .exchange()
                .expectStatus().isNotFound();
    }
}