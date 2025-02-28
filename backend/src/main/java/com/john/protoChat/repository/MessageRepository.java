package com.john.protoChat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.john.protoChat.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
