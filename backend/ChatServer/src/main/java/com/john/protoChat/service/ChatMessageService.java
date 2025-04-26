/*
package com.john.protoChat.service;

import com.john.protoChat.model.ChatMessage;
import com.john.protoChat.model.Message;
import com.john.protoChat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ChatMessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Mono<ChatMessage> send(ChatMessage message) {
        Message savedMessage = new Message();
        savedMessage.setSender(message.getSenderName());
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());

        return messageRepository.save(savedMessage)
                .thenReturn(message);
    }
}
*/