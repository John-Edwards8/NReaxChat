package com.john.chat;

import com.john.chat.model.Message;
import com.john.chat.handler.MessageHandler;
import com.john.chat.router.MessageRouter;
import com.john.chat.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

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

    @Test
    void patchMessage_shouldUpdateContent_whenMessageExists() throws Exception {
        ObjectId id = new ObjectId();
        Message existing = Message.builder()
                .id(id)
                .roomId(new ObjectId())
                .sender("alice")
                .content("old content")
                .timestamp(LocalDateTime.of(2025, 5, 6, 12, 0))
                .build();

        Message updated = Message.builder()
                .id(id)
                .roomId(existing.getRoomId())
                .sender("alice")
                .content("new content")
                .timestamp(existing.getTimestamp())
                .build();

        Mockito.when(repo.findById(eq(id))).thenReturn(Mono.just(existing));
        Mockito.when(repo.save(any(Message.class))).thenReturn(Mono.just(updated));

        Map<String, Object> patchMap = new HashMap<>();
        patchMap.put("content", "new content");
        String patchJson = objectMapper.writeValueAsString(patchMap);

        client.patch().uri("/messages/{id}", id.toHexString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(patchJson)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .expectBody(Message.class)
                .value(resp -> {
                    assert "new content".equals(resp.getContent());
                    assert "alice".equals(resp.getSender());
                });
    }

    @Test
    void patchMessage_shouldReturnNotFound_whenMessageMissing() throws Exception {
        ObjectId id = new ObjectId();
        Mockito.when(repo.findById(eq(id))).thenReturn(Mono.empty());

        Map<String, Object> patchMap = new HashMap<>();
        patchMap.put("content", "irrelevant");
        String patchJson = objectMapper.writeValueAsString(patchMap);

        client.patch().uri("/messages/{id}", id.toHexString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(patchJson)
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void deleteMessage_shouldReturnNoContent_whenMessageExists() {
        ObjectId id = new ObjectId();
        Message existing = Message.builder()
                .id(id)
                .roomId(new ObjectId())
                .sender("bob")
                .content("to be deleted")
                .timestamp(LocalDateTime.of(2025, 5, 6, 12, 5))
                .build();

        Mockito.when(repo.findById(eq(id))).thenReturn(Mono.just(existing));
        Mockito.when(repo.delete(existing)).thenReturn(Mono.empty());

        client.delete().uri("/messages/{id}", id.toHexString())
                .exchange()
                .expectStatus().isNoContent();
    }

    @Test
    void deleteMessage_shouldReturnNotFound_whenMessageMissing() {
        ObjectId id = new ObjectId();
        Mockito.when(repo.findById(eq(id))).thenReturn(Mono.empty());

        client.delete().uri("/messages/{id}", id.toHexString())
                .exchange()
                .expectStatus().isNotFound();
    }
}