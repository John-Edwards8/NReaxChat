package com.john.chat;

import com.john.chat.model.Message;
import com.john.chat.handler.MessageHandler;
import com.john.chat.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.john.chat.service.WebSocketSessionRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.socket.HandshakeInfo;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.net.URI;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MessageHandlerWebSocketTest {

    @Captor
    ArgumentCaptor<Flux<WebSocketMessage>> captor;

    MessageRepository repo;
    ObjectMapper objectMapper;
    MessageHandler handler;
    WebSocketSession session;
    WebSocketSessionRegistry sessionRegistry;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        repo = mock(MessageRepository.class);
        objectMapper = new ObjectMapper();
        handler = new MessageHandler();
        sessionRegistry = mock(WebSocketSessionRegistry.class);

        ReflectionTestUtils.setField(handler, "messageRepository", repo);
        ReflectionTestUtils.setField(handler, "objectMapper", objectMapper);
        ReflectionTestUtils.setField(handler, "sessionRegistry", sessionRegistry);

        session = mock(WebSocketSession.class);
        HandshakeInfo hi = mock(HandshakeInfo.class);

        when(hi.getUri()).thenReturn(URI.create("ws://test/endpoint?roomId=room123"));
        when(session.getHandshakeInfo()).thenReturn(hi);
    }

    @Test
    void handle_shouldSaveIncomingAndReturnSameJson() throws Exception {
        Message incoming = Message.builder()
                .sender("alice")
                .content("yo")
                .timestamp(null)
                .build();
        String incomingJson = objectMapper.writeValueAsString(incoming);

        WebSocketMessage rawMsg = mock(WebSocketMessage.class);
        when(rawMsg.getPayloadAsText()).thenReturn(incomingJson);
        when(session.receive()).thenReturn(Flux.just(rawMsg));

        when(repo.save(any(Message.class))).thenReturn(Mono.just(incoming));

        WebSocketMessage outgoing = mock(WebSocketMessage.class);
        when(session.textMessage(incomingJson)).thenReturn(outgoing);

        when(session.send(captor.capture())).thenReturn(Mono.empty());

        Mono<Void> result = handler.handle(session);
        result.block();

        Flux<WebSocketMessage> sentFlux = captor.getValue();
        StepVerifier.create(sentFlux)
                .expectNext(outgoing)
                .verifyComplete();

        verify(repo).save(any(Message.class));
        verify(session).textMessage(incomingJson);
        verify(sessionRegistry).register("room123", session);
        verify(sessionRegistry).unregister(session);
    }
}