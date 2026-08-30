package com.john.auth.router;

import com.john.auth.handler.AuthHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;

@Configuration(proxyBeanMethods = false)
public class AuthRouter {

	@Bean
	public RouterFunction<ServerResponse> route(AuthHandler handler) {
		return RouterFunctions
				.route(POST("/api/register").and(accept(APPLICATION_JSON)), handler::register)
				.andRoute(POST("/api/login").and(accept(APPLICATION_JSON)), handler::login)
				.andRoute(POST("/api/logout").and(accept(APPLICATION_JSON)), handler::logout)
				.andRoute(POST("/api/refresh") .and(accept(APPLICATION_JSON)), handler::refresh)
				.andRoute(POST("/api/public-key").and(accept(APPLICATION_JSON)), handler::savePublicKey)
				.andRoute(GET("/api/users").and(accept(APPLICATION_JSON)), handler::getAllUsers)
				.andRoute(GET("/api/users/{username}").and(accept(APPLICATION_JSON)), handler::getUser)
				.andRoute(GET("/api/users/{username}/key").and(accept(APPLICATION_JSON)), handler::getUserWithKey)
				.andRoute(GET("/api/users/{username}/public-key").and(accept(APPLICATION_JSON)), handler::getUserPublicKey)
				.andRoute(PATCH("/api/users/{username}").and(accept(APPLICATION_JSON)), handler::updateUser)
				.andRoute(DELETE("/api/users/{username}"), handler::deleteUser);
	}
}
