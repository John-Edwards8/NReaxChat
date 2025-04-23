package com.john.protoChat.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection ="messages")
public class Message {
	@Id
    private Long id;

    private String sender;
    private String content;
    
   // @Column(updatable = false, insertable = false)
    private LocalDateTime timestamp;
}
