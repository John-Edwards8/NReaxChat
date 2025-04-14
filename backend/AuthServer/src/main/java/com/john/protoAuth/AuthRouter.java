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
			.route(GET("/token").and(accept(MediaType.APPLICATION_JSON)), handler::hello)
			.andRoute(GET("/user/{username}").and(accept(MediaType.APPLICATION_JSON)), handler::getUser)
			.andRoute(GET("/createUser").and(accept(MediaType.APPLICATION_JSON)), handler::createUser)
    		.andRoute(GET("/deleteUser/{del}").and(accept(MediaType.APPLICATION_JSON)), handler::deleteUser)
    		.andRoute(GET("/updateUser/{upd}").and(accept(MediaType.APPLICATION_JSON)), handler::updateUser);
	}
	
}
