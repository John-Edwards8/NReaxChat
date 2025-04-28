package com.john.auth.model;

import java.math.BigInteger;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users") 
public class User {
	@Id
	private BigInteger id;
	private String username;
	private String password;

	@Override
	public String toString() {
		return "{" +
				"id='" + id + '\'' + ",\n" +
				"username='" + username + '\'' + ",\n" +
				"password='" + password + '\'' +
				"}";
	}

	public User(Object name, Object pass) {
		this.username = name.toString();
		this.password = pass.toString();
	}
}
