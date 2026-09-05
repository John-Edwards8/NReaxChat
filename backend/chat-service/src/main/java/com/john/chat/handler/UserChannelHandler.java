package com.john.chat.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.util.UriComponentsBuilder;

import com.john.chat.jwt.JwtUtil;
import com.john.chat.service.WebSocketSessionRegistry;

import reactor.core.publisher.Mono;

@Service
public class UserChannelHandler implements WebSocketHandler {
    @Autowired private WebSocketSessionRegistry sessionRegistry;
    @Autowired private JwtUtil jwtUtil;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        String token = UriComponentsBuilder.fromUri(session.getHandshakeInfo().getUri())
                .build().getQueryParams().getFirst("token");
        if (token == null || !jwtUtil.validateToken(token)) {
            return session.close();
        }
        String username = jwtUtil.getUsernameFromToken(token);
        sessionRegistry.registerUserChannel(username, session);
        return session.receive()
            .then()
            .doFinally(sig -> sessionRegistry.unregisterUserChannel(username, session));
    }
}
