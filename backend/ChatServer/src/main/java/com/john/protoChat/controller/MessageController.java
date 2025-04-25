/* package com.john.protoChat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.john.protoChat.model.ChatMessage;
import com.john.protoChat.model.Message;
import com.john.protoChat.service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
	@Autowired private ChatMessageService cms;

    @GetMapping
    public List<Message> getMessages() {
        return cms.getMessages();
    }
    
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
	public Message sendMessage(@Payload ChatMessage cm) {
//		var chatId = chatRoomService
//	            .getChatId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true);
//	    chatMessage.setChatId(chatId.get());

	    ChatMessage saved = cms.send(cm);
		Message message = Message.builder()
							     .sender(saved.getSenderName())
							     .content(saved.getContent())
							     .timestamp(saved.getTimestamp())
							     .build();
	    return message;
	}
}
 */