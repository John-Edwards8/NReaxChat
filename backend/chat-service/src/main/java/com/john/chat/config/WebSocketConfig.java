package com.john.chat.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.reactive.socket.server.WebSocketService;
import org.springframework.web.reactive.socket.server.support.HandshakeWebSocketService;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import org.springframework.web.reactive.socket.server.upgrade.TomcatRequestUpgradeStrategy;

import com.john.chat.handler.MessageHandler;

import reactor.core.publisher.Mono;

@Configuration
public class WebSocketConfig {
    @Autowired
    private MessageHandler handler;

	@Bean
    public WebSocketHandler webSocketHandler() {
        return new WebSocketHandler() {
            @Override
            public Mono<Void> handle(WebSocketSession session) {
                return session.send(Mono.just(session.textMessage("Hello from WebSocket")));
            }
        };
    }

    @Bean
	public HandlerMapping handlerMapping(){
		Map<String, WebSocketHandler> handlerMap = Map.of(
				"/chat", handler
		);
		return new SimpleUrlHandlerMapping(handlerMap, 1);
	}


    @Bean
    public WebSocketHandlerAdapter handlerAdapter(WebSocketService webSocketService) {
        return new WebSocketHandlerAdapter(webSocketService);
    }

    @Bean
    public WebSocketService webSocketService() {
        TomcatRequestUpgradeStrategy strategy = new TomcatRequestUpgradeStrategy();
        strategy.setMaxSessionIdleTimeout(0L);
        return new HandshakeWebSocketService(strategy);
    }
}
