package com.john.chat.router;

import com.john.chat.handler.ChatRoomHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration
public class ChatRoomRouter {

    @Bean
    public RouterFunction<ServerResponse> chatRoomRoutes(ChatRoomHandler chatRoomHandler) {
        return RouterFunctions
            .route(GET("/api/chatrooms"), chatRoomHandler::getAllChatRooms) 
            .andRoute(GET("/api/chatrooms/{id}"), chatRoomHandler::getChatRoom) 
            .andRoute(POST("/api/chatrooms").and(accept(APPLICATION_JSON)), chatRoomHandler::createChatRoom) 
            .andRoute(PUT("/api/chatrooms/{id}").and(accept(APPLICATION_JSON)), chatRoomHandler::updateChatRoom)
            .andRoute(DELETE("/api/chatrooms/{id}"), chatRoomHandler::deleteChatRoom);

    }
}
