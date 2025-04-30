package com.john.auth.service;

import com.john.auth.repos.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserDetailsService implements ReactiveUserDetailsService {

    private final AuthRepository authRepository;

    @Autowired
    public UserDetailsService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return authRepository.findByUsername(username)
                .switchIfEmpty(Mono.error(new UsernameNotFoundException("User not found: " + username)))
                .map(u -> User.withUsername(u.getUsername())
                        .password(u.getPassword())
                        .roles("ROLE_USER")
                        .build());
    }
}
