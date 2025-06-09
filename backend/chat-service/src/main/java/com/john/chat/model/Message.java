package com.john.chat.model;

import java.time.Instant;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
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
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId roomId;
    private String sender;
    private String content;
    
    private Instant timestamp;
}
