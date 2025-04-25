package com.john.protoChat.router;

import com.john.protoChat.handler.MessageHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.POST;

@Configuration
public class MessageRouter {

    @Bean
    public RouterFunction<ServerResponse> route(MessageHandler messageHandler) {
        return RouterFunctions
            .route(GET("/messages"), messageHandler::getMessages)  // Для отримання повідомлень
            .andRoute(POST("/messages"), messageHandler::sendMessage); // Для додавання нового повідомлення
    }
}
