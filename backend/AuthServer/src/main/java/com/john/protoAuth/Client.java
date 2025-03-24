package com.john.protoAuth;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Component
public class Client {
	private final WebClient client;
	public Client(WebClient.Builder builder) {
		this.client = builder.baseUrl("http://localhost:8081").build();
	}
	
	public Mono<String> getMessage() {
	    return this.client.get().uri("/hello").accept(MediaType.APPLICATION_JSON)
	        .retrieve()
	        .bodyToMono(Test.class)
	        .map(Test::getMessage);
	}
}
