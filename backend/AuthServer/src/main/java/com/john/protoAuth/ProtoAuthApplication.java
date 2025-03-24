package com.john.protoAuth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ProtoAuthApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(ProtoAuthApplication.class, args);
	    Client cli = context.getBean(Client.class);

	    System.out.println(">> message = " + cli.getMessage().block());
	}

}
