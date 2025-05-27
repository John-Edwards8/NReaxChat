package com.john.gateway;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(
        classes = GatewayApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@AutoConfigureWebTestClient
class GatewayIntegrationTest {

    private static final MockWebServer authServer = new MockWebServer();
    private static final MockWebServer chatServer = new MockWebServer();

    @Autowired
    private WebTestClient webClient;

    @DynamicPropertySource
    static void overrideGatewayUrls(DynamicPropertyRegistry registry) throws Exception {
        authServer.start();
        chatServer.start();
        registry.add("AUTH_URL", () -> authServer.url("/").toString());
        registry.add("CHAT_URL", () -> chatServer.url("/").toString());
    }

    @AfterAll
    static void tearDown() throws Exception {
        authServer.shutdown();
        chatServer.shutdown();
    }

    @Test
    void proxyToAuthService() {
        authServer.enqueue(new MockResponse()
                .setBody("AUTH_OK")
                .addHeader("Content-Type", "text/plain"));

        WebTestClient clientWithHost = webClient.mutate()
                .defaultHeader(HttpHeaders.HOST, "localhost")
                .build();

        clientWithHost.get()
                .uri("/auth/login")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("AUTH_OK");
    }

    @Test
    void proxyToChatService() {
        chatServer.enqueue(new MockResponse()
                .setBody("CHAT_OK")
                .addHeader("Content-Type", "text/plain"));

        WebTestClient clientWithHost = webClient.mutate()
                .defaultHeader(HttpHeaders.HOST, "localhost")
                .build();

        clientWithHost.get()
                .uri("/chat/rooms")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class).isEqualTo("CHAT_OK");
    }
}