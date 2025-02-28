package com.john.protoChat.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.john.protoChat.model.Message;
import com.john.protoChat.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageRestController {
	private final MessageRepository messageRepository;

    @GetMapping
    public List<Message> getMessages() {
        return messageRepository.findAll();
    }
}
