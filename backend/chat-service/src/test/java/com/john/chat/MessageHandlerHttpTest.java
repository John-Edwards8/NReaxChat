package com.john.chat;

import com.john.chat.model.Message;
import com.john.chat.handler.MessageHandler;
import com.john.chat.router.MessageRouter;
import com.john.chat.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;

class MessageHandlerHttpTest {

    MessageRepository repo;
    ObjectMapper objectMapper;
    WebTestClient client;

    @BeforeEach
    void setup() {
        repo = Mockito.mock(MessageRepository.class);
        objectMapper = new ObjectMapper();
        MessageHandler handler = new MessageHandler();

        ReflectionTestUtils.setField(handler, "messageRepository", repo);
        ReflectionTestUtils.setField(handler, "objectMapper", objectMapper);

        client = WebTestClient.bindToRouterFunction(
                new MessageRouter().route(handler)
        ).build();
    }

    @Test
    void getMessages_shouldReturnJsonArray() {
        Message m1 = new Message();
        m1.setSender("alice");
        m1.setContent("hello");
        m1.setTimestamp(LocalDateTime.of(2025, 5, 6, 12, 0));

        Message m2 = new Message();
        m2.setSender("bob");
        m2.setContent("hi");
        m2.setTimestamp(LocalDateTime.of(2025, 5, 6, 12, 1));

        Mockito.when(repo.findAll()).thenReturn(Flux.just(m1, m2));

        client.get().uri("/messages")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .expectBodyList(Message.class)
                .hasSize(2)
                .value(list -> {
                    assert "alice".equals(list.get(0).getSender());
                    assert "bob".equals(list.get(1).getSender());
                });
    }
}