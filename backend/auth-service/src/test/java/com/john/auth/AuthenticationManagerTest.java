package com.john.auth;

import com.john.auth.security.AuthenticationManager;
import com.john.auth.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.Mockito.when;

class AuthenticationManagerTest {
    private AuthenticationManager manager;
    private JwtUtil jwtUtil;

    @BeforeEach
    void init() {
        jwtUtil = Mockito.mock(JwtUtil.class);
        manager = new AuthenticationManager(jwtUtil);
    }

    @Test
    void authenticate_shouldError_whenInvalidAccessToken() {
        String token = "badToken";
        when(jwtUtil.validateToken(token, "access")).thenReturn(false);

        Mono<Authentication> result = manager.authenticate(
                new UsernamePasswordAuthenticationToken(null, token)
        );

        StepVerifier.create(result)
                .expectError(BadCredentialsException.class)
                .verify();
    }

    @Test
    void authenticate_shouldAuthenticate_whenValidAccessToken() {
        String token = "goodToken";
        when(jwtUtil.validateToken(token, "access")).thenReturn(true);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user1");
        when(jwtUtil.getRoleFromToken(token)).thenReturn("USER");

        Mono<Authentication> result = manager.authenticate(
                new UsernamePasswordAuthenticationToken(null, token)
        );

        StepVerifier.create(result)
                .assertNext(auth -> {
                    assert auth.getPrincipal().equals("user1");
                    assert auth.getAuthorities().contains(new SimpleGrantedAuthority("USER"));
                })
                .verifyComplete();
    }
}