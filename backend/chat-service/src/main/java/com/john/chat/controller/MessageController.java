package com.john.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.john.chat.repository.MessageRepository;
import com.john.chat.model.Message;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Controller
@RequiredArgsConstructor
public class MessageController {
	@Autowired private MessageRepository messageRepository;

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Mono<Message> handleMessageReactive(Message message) {
    	Message savedMessage = new Message();
        savedMessage.setSender(message.getSender());
        savedMessage.setContent(message.getContent());
        savedMessage.setTimestamp(message.getTimestamp());

        return messageRepository.save(message);
    }
}
 