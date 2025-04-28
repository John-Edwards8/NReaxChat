package com.john.auth;

import com.john.auth.security.AuthenticationManager;
import com.john.auth.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.test.StepVerifier;
import reactor.core.publisher.Mono;

class AuthenticationManagerTest {
    private AuthenticationManager manager;
    private JwtUtil jwtUtil;
    private ReactiveUserDetailsService uds;

    @BeforeEach
    void init() {
        jwtUtil = Mockito.mock(JwtUtil.class);
        uds = Mockito.mock(ReactiveUserDetailsService.class);
        manager = new AuthenticationManager(jwtUtil, uds);
    }

    @Test
    void authenticate_shouldError_whenInvalidToken() {
        Mockito.when(jwtUtil.validateToken("bad")).thenReturn(false);
        Mono<?> m = manager.authenticate(new UsernamePasswordAuthenticationToken("bad", "bad"));
        StepVerifier.create(m).expectError(BadCredentialsException.class).verify();
    }

    @Test
    void authenticate_shouldAuthenticate_whenValidToken() {
        Mockito.when(jwtUtil.validateToken("good")).thenReturn(true);
        Mockito.when(jwtUtil.getUsernameFromToken("good")).thenReturn("user1");
        UserDetails userDetails = User.withUsername("user1").password("x").roles("USER").build();
        Mockito.when(uds.findByUsername("user1")).thenReturn(Mono.just(userDetails));

        Mono<Authentication> m = manager.authenticate(new UsernamePasswordAuthenticationToken("good", "good"));
        StepVerifier.create(m)
                .expectNextMatches(auth -> auth.getPrincipal().equals(userDetails))
                .verifyComplete();
    }
}