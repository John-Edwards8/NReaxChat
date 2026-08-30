package com.john.chat.service;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketSession;

@Service
public class WebSocketSessionRegistry {
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public void register(String roomId, WebSocketSession session) {
        sessions.put(session.getId() + ":" + roomId, session);
    }

    public void unregister(WebSocketSession session) {
        sessions.entrySet().removeIf(e -> e.getKey().startsWith(session.getId()));
    }

    public Collection<WebSocketSession> getSessionsForRoom(String roomId) {
        return sessions.entrySet().stream()
            .filter(entry -> entry.getKey().endsWith(":" + roomId))
            .map(Map.Entry::getValue)
            .toList();
    }
}
