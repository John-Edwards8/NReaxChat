package com.john.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String base64Secret;
    private Key key;

    @Setter private long accessValidityMs  = 15 * 60_000;
    @Setter private long refreshValidityMs = 7 * 24 * 60 * 60_000L;

    private final Set<String> blacklistedRefresh = Collections.synchronizedSet(new HashSet<>());

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String username, String role) {
        return buildToken(username, role, accessValidityMs, "access");
    }
    public String generateRefreshToken(String username, String role) {
        return buildToken(username, role, refreshValidityMs, "refresh");
    }

    private String buildToken(String username, String role, long validity, String type) {
        Date now = new Date(), exp = new Date(now.getTime() + validity);
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("role", role);
        claims.put("type", type);
        return Jwts.builder()
                .setClaims(claims).setIssuedAt(now).setExpiration(exp)
                .signWith(key).compact();
    }

    public boolean validateToken(String token, String expectedType) {
        try {
            Claims body = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String type = body.get("type", String.class);
            Date expiration = body.getExpiration();

            if (!expectedType.equals(type)) {
                return false;
            }

            if (expiration.before(new Date())) {
                return false;
            }

            if (expectedType.equals("refresh") && blacklistedRefresh.contains(token)) {
                return false;
            }

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public void blacklistRefreshToken(String refreshToken) {
        blacklistedRefresh.add(refreshToken);
    }
}