package com.john.chat.router;

import com.john.chat.handler.ChatRoomHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

@Configuration
public class ChatRoomRouter {

    @Bean
    public RouterFunction<ServerResponse> chatRoomRoutes(ChatRoomHandler chatRoomHandler) {
        return RouterFunctions.route(GET("/chat-rooms/my"), chatRoomHandler::getMyChatRooms);
    }
}
