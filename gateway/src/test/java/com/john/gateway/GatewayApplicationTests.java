package com.john.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"AUTH_URL=http://auth-service.test",
		"CHAT_URL=http://chat-service.test",
		"FRONTEND_URL=http://frontend.test",
		"FRONTEND_URL_DEV=http://frontend-dev.test"
})
class GatewayApplicationTests {

	@Test
	void contextLoads() {
	}

}
