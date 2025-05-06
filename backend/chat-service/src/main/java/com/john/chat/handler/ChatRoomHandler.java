package com.john.chat.handler;

import com.john.chat.model.ChatRoom;
import com.john.chat.repository.ChatRoomRepository;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;

import org.bson.types.ObjectId;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Used safely")
public class ChatRoomHandler {

    private final ChatRoomRepository chatRoomRepository;

    public Mono<ServerResponse> getMyChatRooms(ServerRequest request) {
        String userIdStr = request.queryParam("userId").orElse(null);
        if (userIdStr == null || !ObjectId.isValid(userIdStr)) {
            return ServerResponse.badRequest().bodyValue("Invalid or missing userId");
        }

        ObjectId userId = new ObjectId(userIdStr);
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(chatRoomRepository.findByUser(userId, userId), ChatRoom.class);
    }
}