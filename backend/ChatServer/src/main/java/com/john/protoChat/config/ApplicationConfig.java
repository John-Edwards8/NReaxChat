package com.john.protoChat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

@Configuration
@EnableReactiveMongoRepositories("com.john.protoChat.repository")
public class ApplicationConfig extends AbstractReactiveMongoConfiguration{
	@Bean
    MongoClient mongoClient() {
        return MongoClients.create();
    }
	
	@Override
	protected String getDatabaseName() {
		return "chat";
	}

}
