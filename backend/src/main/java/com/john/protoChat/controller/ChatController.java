package com.john.protoChat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.john.protoChat.model.ChatMessage;
import com.john.protoChat.model.Message;
import com.john.protoChat.service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
	
	@Autowired private ChatMessageService cms;
	
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
