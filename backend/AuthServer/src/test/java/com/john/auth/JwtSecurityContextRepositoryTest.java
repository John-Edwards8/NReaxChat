package com.john.auth;

import com.john.auth.security.AuthenticationManager;
import com.john.auth.security.JwtSecurityContextRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class JwtSecurityContextRepositoryTest {
    private JwtSecurityContextRepository repo;
    private AuthenticationManager authManager;

    @BeforeEach
    void init() {
        authManager = Mockito.mock(AuthenticationManager.class);
        repo = new JwtSecurityContextRepository(authManager);
    }

    @Test
    void load_shouldEmpty_whenNoHeader() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/"));
        StepVerifier.create(repo.load(exchange)).expectComplete().verify();
    }

    @Test
    void load_shouldError_whenInvalidToken() {
        var request = MockServerHttpRequest.get("/")
                .header("Authorization", "Bearer badtoken");
        var exchange = MockServerWebExchange.from(request);
        Mockito.when(authManager.authenticate(Mockito.any()))
                .thenReturn(Mono.error(new BadCredentialsException("Invalid token")));

        StepVerifier.create(repo.load(exchange))
                .expectError(BadCredentialsException.class)
                .verify();
    }

    @Test
    void load_shouldReturnContext_whenValidToken() {
        var request = MockServerHttpRequest.get("/")
                .header("Authorization", "Bearer goodtoken");
        var exchange = MockServerWebExchange.from(request);
        var auth = new UsernamePasswordAuthenticationToken("user", null);
        Mockito.when(authManager.authenticate(Mockito.any()))
                .thenReturn(Mono.just(auth));

        StepVerifier.create(repo.load(exchange))
                .expectNextMatches(sc -> sc.getAuthentication().equals(auth))
                .verifyComplete();
    }
}