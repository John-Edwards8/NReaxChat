package com.john.chat.router;

import com.john.chat.handler.UserHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration
public class UserRouter {

    @Bean
    public RouterFunction<ServerResponse> route(UserHandler userHandler) {
        return RouterFunctions
            .route(POST("/register"), userHandler::register)
            .andRoute(GET("/user/{username}"), userHandler::getUser)
            .andRoute(PUT("/user/{username}"), userHandler::updateUser)
            .andRoute(DELETE("/user/{username}"), userHandler::deleteUser);
    }
}