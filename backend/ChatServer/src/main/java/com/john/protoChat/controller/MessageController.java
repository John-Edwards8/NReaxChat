 package com.john.protoChat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.john.protoChat.repository.MessageRepository;
import com.john.protoChat.model.Message;
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
 