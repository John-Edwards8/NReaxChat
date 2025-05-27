package com.john.chat.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRoomDTO {
    private String name;
    private List<String> members;
    private boolean group;
}
