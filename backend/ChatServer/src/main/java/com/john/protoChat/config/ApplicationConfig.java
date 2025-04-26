package com.john.protoChat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

@Configuration
@EnableReactiveMongoRepositories("com.john.protoChat.repository")
public class ApplicationConfig {
	@Bean
    MongoClient mongoClient(@Value("${spring.data.mongodb.uri}") String mongoUri) {
        return MongoClients.create(mongoUri);
    }
	
	@Bean
    ReactiveMongoTemplate reactiveMongoTemplate(MongoClient mongoClient) {
        return new ReactiveMongoTemplate(mongoClient, "chat");
    }

}
