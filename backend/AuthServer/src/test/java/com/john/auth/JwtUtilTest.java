package com.john.auth;

import com.john.auth.security.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JwtUtilTest {
    private JwtUtil jwtUtil;
    private final String secret = Base64.getEncoder()
            .encodeToString("super-secret-key-which-should-be-very-long".getBytes());

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "base64Secret", secret);
        jwtUtil.init();
    }

    @Test
    void generateAndValidateToken() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.getUsernameFromToken(token)).isEqualTo(username);
    }

    @Test
    void expiredTokenShouldBeInvalid() throws InterruptedException {
        jwtUtil.setValidityInMs(10L);
        String token = jwtUtil.generateToken("user");
        Thread.sleep(20);
        assertThat(jwtUtil.validateToken(token)).isFalse();
    }

    @Test
    void validateTokenShouldReturnFalseOnMalformed() {
        assertThat(jwtUtil.validateToken("not.jwt.token")).isFalse();
    }

    @Test
    void getUsernameFromInvalidTokenShouldThrow() {
        assertThrows(JwtException.class, () -> jwtUtil.getUsernameFromToken("not.jwt.token"));
    }
}
