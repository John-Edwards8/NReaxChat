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
<<<<<<< HEAD:backend/ChatServer/src/main/java/com/john/protoChat/router/MessageRouter.java
<<<<<<< Updated upstream:backend/ChatServer/src/main/java/com/john/protoChat/router/MessageRouter.java
            .route(GET("/messages"), messageHandler::getMessages)  // Для отримання повідомлень
            .andRoute(POST("/messages"), messageHandler::sendMessage); // Для додавання нового повідомлення
=======
            .route(GET("/messages"), messageHandler::getMessages)
            .andRoute(GET("/messages/room/{roomId}"), messageHandler::getMessagesByRoomId);
>>>>>>> Stashed changes:backend/chat-service/src/main/java/com/john/chat/router/MessageRouter.java
=======
            .route(GET("/messages"), messageHandler::getMessages);
>>>>>>> dev:backend/chat-service/src/main/java/com/john/chat/router/MessageRouter.java
    }

}
