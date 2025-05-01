package com.john.auth.config;

import com.john.auth.security.JwtSecurityContextRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.ReactiveAuthorizationManager;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    private final ReactiveAuthenticationManager authManager;
    private final JwtSecurityContextRepository securityContextRepository;

    @Autowired
    public SecurityConfig(ReactiveAuthenticationManager authManager, JwtSecurityContextRepository securityContextRepository) {
        this.authManager = authManager;
        this.securityContextRepository = securityContextRepository;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .securityMatcher(ServerWebExchangeMatchers.anyExchange())
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.POST,
                                "/api/login","/api/register","/api/refresh","/api/logout")
                        .permitAll()

                        .pathMatchers(HttpMethod.POST, "/api/users").hasAuthority("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/users").hasAuthority("ADMIN")

                        .pathMatchers(HttpMethod.GET, "/api/users/{username}")
                        .access(isAdminOrSelf())

                        .pathMatchers(HttpMethod.PUT, "/api/users/{username}")
                        .access(isAdminOrSelf())
                        .pathMatchers(HttpMethod.DELETE, "/api/users/{username}")
                        .access(isAdminOrSelf())

                        .anyExchange().authenticated()
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authenticationManager(authManager)
                .securityContextRepository(securityContextRepository)
                .build();
    }

    private ReactiveAuthorizationManager<AuthorizationContext> isAdminOrSelf() {
        return (monoAuth, ctx) -> monoAuth
                .map(auth -> {
                    boolean isAdmin = auth.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ADMIN"));
                    String pathUser = (String) ctx.getVariables().get("username");
                    String principal = auth.getName();
                    boolean isSelf = principal.equals(pathUser);

                    return new AuthorizationDecision(isAdmin || isSelf);
                });
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}