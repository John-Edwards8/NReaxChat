package com.john.chat.service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketSession;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Service
public class WebSocketSessionRegistry {
	private final Map<String, Sinks.Many<String>> roomSinks = new ConcurrentHashMap<>();
    private final Map<String, Set<WebSocketSession>> userChannels = new ConcurrentHashMap<>();
    
    public Sinks.Many<String> register(String roomId, WebSocketSession session) {
        Sinks.Many<String> sink = Sinks.many().multicast().onBackpressureBuffer();
        roomSinks.put(session.getId() + ":" + roomId, sink);
        return sink;
    }
 
    public void unregister(WebSocketSession session) {
        roomSinks.entrySet().removeIf(e -> {
            boolean match = e.getKey().startsWith(session.getId() + ":");
            if (match) {
                e.getValue().tryEmitComplete();
            }
            return match;
        });
    }
 
    public void sendToRoom(String roomId, String payload) {
        String suffix = ":" + roomId;
        roomSinks.forEach((key, sink) -> {
            if (key.endsWith(suffix)) {
                sink.tryEmitNext(payload);
            }
        });
    }
    
    public void registerUserChannel(String username, WebSocketSession session) {
        userChannels.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(session);
    }

    public void unregisterUserChannel(String username, WebSocketSession session) {
        userChannels.getOrDefault(username, Set.of()).remove(session);
    }
    
    public void sendToUser(String username, String payload) {
        for (WebSocketSession s : userChannels.getOrDefault(username, Set.of())) {
            if (s.isOpen()) s.send(Mono.just(s.textMessage(payload))).subscribe();
        }
    }
}
