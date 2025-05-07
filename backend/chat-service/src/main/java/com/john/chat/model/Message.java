package com.john.chat.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection ="messages")
@SuppressFBWarnings(value = "EI_EXPOSE_REP", justification = "Used safely")
public class Message {
	@Id
    private ObjectId id;

    private ObjectId roomId;
    private String sender;
    private String content;
    
   // @Column(updatable = false, insertable = false)
    private LocalDateTime timestamp;
}
