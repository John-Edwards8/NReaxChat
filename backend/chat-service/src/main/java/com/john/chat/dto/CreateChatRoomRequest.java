package com.john.chat.dto;

import lombok.Data;
import org.bson.types.ObjectId;
import java.util.List;

@Data
public class CreateChatRoomRequest {
    private String name;
    private List<ObjectId> members;
    private boolean group;
}
