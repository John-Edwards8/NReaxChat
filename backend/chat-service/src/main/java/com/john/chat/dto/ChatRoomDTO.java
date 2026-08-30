package com.john.chat.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ChatRoomDTO {
    private String roomId;
    private String name;
    private List<String> members;
    private boolean group;
    private Map<String, String> encryptedKeys;
}
