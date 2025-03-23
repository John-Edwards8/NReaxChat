package com.john.protoChat.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
//	@Id
//  private String id;
//  private String chatId;
//  private String senderId;
//	private String recipientId;
	private String senderName;
//	private String recipientName;
	private String content;
	private LocalDateTime timestamp;
//	private MessageStatus status;
}
