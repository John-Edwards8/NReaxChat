package com.john.chat.router;

import com.john.chat.handler.MessageHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
public class MessageRouter {

    @Bean
    public RouterFunction<ServerResponse> route(MessageHandler messageHandler) {
        return RouterFunctions
            .route(GET("/messages"), messageHandler::getMessages)
            .andRoute(GET("/messages/room/{roomId}"), messageHandler::getMessagesByRoomId);
    }
}
