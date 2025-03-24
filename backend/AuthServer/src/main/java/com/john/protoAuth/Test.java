package com.john.protoAuth;

public class Test {
	private String message;
	public Test(String message) {
		this.message = message;
	}
	public String getMessage() {
		return this.message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "Greeting{" +
				"message='" + message + '\'' +
				'}';
	}
}
