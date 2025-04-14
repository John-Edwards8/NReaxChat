package com.john.protoChat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.john.protoChat.model.ChatMessage;
import com.john.protoChat.model.Message;
import com.john.protoChat.repository.MessageRepository;

@Service
public class ChatMessageService {
	
    @Autowired private MessageRepository messageRepository;
    
    public List<Message> getMessages() {
        return messageRepository.findAll();
    }
	
    public ChatMessage send(ChatMessage message) {
        Message savedMessage = new Message();
        savedMessage.setSender(message.getSenderName());
        savedMessage.setContent(message.getContent());
        messageRepository.save(savedMessage);
        
        return message;
    }
}
