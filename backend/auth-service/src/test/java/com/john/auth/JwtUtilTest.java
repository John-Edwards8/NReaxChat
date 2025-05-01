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
    private static final String SECRET = Base64.getEncoder()
            .encodeToString("super-secret-key-which-should-be-very-long".getBytes());
    private static final String ROLE = "USER";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "base64Secret", SECRET);
        jwtUtil.init();
    }

    @Test
    void generateAndValidateAccessAndRefreshTokens() {
        String username = "testUser";
        String access = jwtUtil.generateAccessToken(username, ROLE);
        String refresh = jwtUtil.generateRefreshToken(username, ROLE);

        assertThat(jwtUtil.validateToken(access, "access")).isTrue();
        assertThat(jwtUtil.validateToken(refresh, "refresh")).isTrue();
        assertThat(jwtUtil.getUsernameFromToken(access)).isEqualTo(username);
        assertThat(jwtUtil.getRoleFromToken(refresh)).isEqualTo(ROLE);
    }

    @Test
    void expiredAccessTokenShouldBeInvalid() throws InterruptedException {
        jwtUtil.setAccessValidityMs(10L);
        String at = jwtUtil.generateAccessToken("user", ROLE);
        Thread.sleep(20);
        assertThat(jwtUtil.validateToken(at, "access")).isFalse();
    }

    @Test
    void expiredRefreshTokenShouldBeInvalid() throws InterruptedException {
        jwtUtil.setRefreshValidityMs(10L);
        String rt = jwtUtil.generateRefreshToken("user", ROLE);
        Thread.sleep(20);
        assertThat(jwtUtil.validateToken(rt, "refresh")).isFalse();
    }

    @Test
    void validateTokenShouldReturnFalseOnMalformed() {
        assertThat(jwtUtil.validateToken("not.jwt", "access")).isFalse();
    }

    @Test
    void getUsernameFromInvalidTokenShouldThrow() {
        assertThrows(JwtException.class, () -> jwtUtil.getUsernameFromToken("not.jwt"));
    }

    @Test
    void getRoleFromInvalidTokenShouldThrow() {
        assertThrows(JwtException.class, () -> jwtUtil.getRoleFromToken("not.jwt"));
    }
}