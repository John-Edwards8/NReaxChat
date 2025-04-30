package com.john.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration(proxyBeanMethods = false)
public class AuthRouter {

	@Bean
	public RouterFunction<ServerResponse> route(AuthHandler handler) {
		return RouterFunctions
				.route(POST("/api/register").and(accept(MediaType.APPLICATION_JSON)), handler::register)
				.andRoute(POST("/api/login").and(accept(MediaType.APPLICATION_JSON)), handler::login)
				.andRoute(POST("/api/logout").and(accept(MediaType.APPLICATION_JSON)), handler::logout)
				.andRoute(POST("/api/refresh") .and(accept(MediaType.APPLICATION_JSON)), handler::refresh)
				.andRoute(GET("/user/{username}").and(accept(MediaType.APPLICATION_JSON)), handler::getUser)
				.andRoute(PUT("/updateUser/{username}").and(accept(MediaType.APPLICATION_JSON)), handler::updateUser)
				.andRoute(DELETE("/deleteUser/{username}").and(accept(MediaType.APPLICATION_JSON)), handler::deleteUser);
	}
}
