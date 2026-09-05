package com.john.chat.service;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Mono;

@Service
public class WebSocketSessionRegistry {
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Set<WebSocketSession>> userChannels = new ConcurrentHashMap<>();
    
    public void register(String roomId, WebSocketSession session) {
        sessions.put(session.getId() + ":" + roomId, session);
    }

    public void unregister(WebSocketSession session) {
        sessions.entrySet().removeIf(e -> e.getKey().startsWith(session.getId()));
    }
    
    public void registerUserChannel(String username, WebSocketSession session) {
        userChannels.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(session);
    }

    public void unregisterUserChannel(String username, WebSocketSession session) {
        userChannels.getOrDefault(username, Set.of()).remove(session);
    }

    public Collection<WebSocketSession> getSessionsForRoom(String roomId) {
        return sessions.entrySet().stream()
            .filter(entry -> entry.getKey().endsWith(":" + roomId))
            .map(Map.Entry::getValue)
            .toList();
    }
    
    public void sendToUser(String username, String payload) {
        for (WebSocketSession s : userChannels.getOrDefault(username, Set.of())) {
            if (s.isOpen()) s.send(Mono.just(s.textMessage(payload))).subscribe();
        }
    }
}
