package com.john.chat.handler;

import com.john.chat.dto.ChatRoomDTO;
import com.john.chat.dto.CreateChatRoomRequest;
import com.john.chat.model.ChatRoom;
import com.john.chat.repository.ChatRoomRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Used safely")
public class ChatRoomHandler {

    private final ChatRoomRepository chatRoomRepository;

    private ChatRoomDTO toChatRoomDTO(ChatRoom chatRoom) {
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setName(chatRoom.getName());
        chatRoomDTO.setMembers(chatRoom.getMembers());
        chatRoomDTO.setGroup(chatRoom.isGroup());
        return chatRoomDTO;
    }

    public Mono<ServerResponse> getAllChatRooms(ServerRequest request) {
        Flux<ChatRoomDTO> allChatRooms = chatRoomRepository.findAll()
                .map(this::toChatRoomDTO);

        return ServerResponse.ok()
                .contentType(APPLICATION_JSON)
                .body(allChatRooms, ChatRoomDTO.class);
    }

     public Mono<ServerResponse> getChatRoom(ServerRequest request) {
        String id = request.pathVariable("id");
        return chatRoomRepository.findById(new ObjectId(id))
                .map(this::toChatRoomDTO)
                .flatMap(chatRoom -> ServerResponse.ok()
                        .contentType(APPLICATION_JSON)
                        .bodyValue(chatRoom))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
    

    public Mono<ServerResponse> createChatRoom(ServerRequest request) {
        return request.bodyToMono(CreateChatRoomRequest.class)
                .flatMap(req -> chatRoomRepository.findByName(req.getName())
                        .flatMap(existingRoom ->
                                ServerResponse.badRequest().bodyValue("Chat room name already exists"))
                        .switchIfEmpty((Mono<? extends ServerResponse>) Mono.defer(() -> {
                            ChatRoom newRoom = new ChatRoom();
                            newRoom.setName(req.getName());
                            newRoom.setMembers(req.getMembers());
                            newRoom.setGroup(req.isGroup());
                            return chatRoomRepository.save(newRoom)
                                    .flatMap(savedRoom -> ServerResponse
                                            .created(request.uriBuilder()
                                                    .path("/api/chatrooms/{id}")
                                                    .build(savedRoom.getId()))
                                            .contentType(APPLICATION_JSON)
                                            .bodyValue(toChatRoomDTO(savedRoom))
                                    );
                        }))
                );
    }

    public Mono<ServerResponse> deleteChatRoom(ServerRequest request) {
        String id = request.pathVariable("id");
        return chatRoomRepository.findById(new ObjectId(id))
                .flatMap(chatRoom -> chatRoomRepository.delete(chatRoom)
                        .then(ServerResponse.noContent().build()))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    public Mono<ServerResponse> updateChatRoom(ServerRequest request) {
        String id = request.pathVariable("id");

        return request.bodyToMono(CreateChatRoomRequest.class)
                .flatMap(updatedData ->
                        chatRoomRepository.findById(new ObjectId(id))
                                .flatMap(existingRoom -> {
                                    if (updatedData.getName() != null) {
                                        existingRoom.setName(updatedData.getName());
                                    }
                                    existingRoom.setGroup(updatedData.isGroup());
                                    if (updatedData.getMembers() != null) {
                                        existingRoom.setMembers(updatedData.getMembers());
                                    }
                                    return chatRoomRepository.save(existingRoom);
                                })
                )
                .map(this::toChatRoomDTO)
                .flatMap(updatedRoom ->
                        ServerResponse.ok()
                                .contentType(APPLICATION_JSON)
                                .bodyValue(updatedRoom))
                .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    
}