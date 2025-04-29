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

import static org.junit.jupiter.api.Assertions.*;
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
    void authenticate_shouldError_whenInvalidToken() {
        when(jwtUtil.validateToken("badToken")).thenReturn(false);

        Mono<Authentication> result = manager.authenticate(
                new UsernamePasswordAuthenticationToken(null, "badToken")
        );

        StepVerifier.create(result)
                .expectError(BadCredentialsException.class)
                .verify();
    }

    @Test
    void authenticate_shouldAuthenticate_whenValidToken() {
        when(jwtUtil.validateToken("goodToken")).thenReturn(true);
        when(jwtUtil.getUsernameFromToken("goodToken")).thenReturn("user1");
        when(jwtUtil.getRoleFromToken("goodToken")).thenReturn("ROLE_USER");

        Mono<Authentication> result = manager.authenticate(
                new UsernamePasswordAuthenticationToken(null, "goodToken")
        );

        StepVerifier.create(result)
                .assertNext(auth -> {
                    assertEquals("user1", auth.getPrincipal());
                    assertEquals(1, auth.getAuthorities().size());
                    assertTrue(auth.getAuthorities().contains(
                            new SimpleGrantedAuthority("ROLE_USER")
                    ));
                })
                .verifyComplete();
    }
}
