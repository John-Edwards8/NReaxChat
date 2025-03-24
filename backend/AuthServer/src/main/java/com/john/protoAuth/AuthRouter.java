package com.john.protoAuth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration(proxyBeanMethods = false)
public class AuthRouter {
    @Bean
    RouterFunction<ServerResponse> route(AuthHandler handler) {
		return RouterFunctions
			.route(GET("/hello").and(accept(MediaType.APPLICATION_JSON)), handler::hello);
	}
	
}
