package com.john.chat.handler;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

import com.fasterxml.jackson.databind.JsonNode;
import com.john.chat.dto.ChatRoomDTO;
import com.john.chat.dto.ChatRoomInfo;
import com.john.chat.dto.CreateChatRoomRequest;
import com.john.chat.jwt.JwtUtil;
import com.john.chat.model.ChatRoom;
import com.john.chat.repository.ChatRoomRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Used safely")
public class ChatRoomHandler {

    private final ChatRoomRepository chatRoomRepository;
    private final JwtUtil jwtUtil;

    private ChatRoomDTO toChatRoomDTO(ChatRoom chatRoom) {
        ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
        chatRoomDTO.setRoomId(chatRoom.getId().toHexString());
        chatRoomDTO.setName(chatRoom.getName());
        chatRoomDTO.setMembers(chatRoom.getMembers());
        chatRoomDTO.setGroup(chatRoom.isGroup());
        chatRoomDTO.setEncryptedKeys(chatRoom.getEncryptedKeys());
        return chatRoomDTO;
    }

    public Mono<String> getPublicKey(String username, String accessToken) {
        WebClient webClient = WebClient.builder()
                .baseUrl("http://gateway:8080/auth/api")
                .defaultHeader("Authorization", "Bearer " + accessToken)
                .build();

        return webClient.get()
                .uri("/users/{username}/public-key", username)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(node -> node.get("publicKey").asText());
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

    public Mono<ServerResponse> getMyChatRooms(ServerRequest request) {
        String auth = request.headers()
                .firstHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ServerResponse.status(401)
                    .bodyValue("Missing or invalid Authorization header");
        }

        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ServerResponse.status(401)
                    .bodyValue("Invalid or expired token");
        }

        String userId = jwtUtil.getUsernameFromToken(token);

        Flux<ChatRoomInfo> rooms = chatRoomRepository
                .findByMembersContaining(userId)
                .map(room -> {
                    ChatRoomInfo info = new ChatRoomInfo();
                    info.setRoomId(room.getId().toHexString());
                    info.setName(room.getName());
                    info.setGroup(room.isGroup());
                    info.setMembers(room.getMembers());

                    return info;
                });

        return ServerResponse.ok()
                .contentType(APPLICATION_JSON)
                .body(rooms, ChatRoomInfo.class);
    }

    public Mono<ServerResponse> createChatRoom(ServerRequest request) {
        String rawHeader = request.headers().firstHeader("Authorization");
        String accessToken = rawHeader != null && rawHeader.startsWith("Bearer ")
                ? rawHeader.substring(7)
                : "";
        return request.bodyToMono(CreateChatRoomRequest.class)
                .flatMap(req -> chatRoomRepository.findByName(req.getName())
                        .flatMap(existingRoom ->
                                ServerResponse.badRequest().bodyValue("Chat room name already exists"))
                        .switchIfEmpty((Mono<? extends ServerResponse>) Mono.defer(() -> {
                            String aesKey = generateRoomKey();
                            return Flux.fromIterable(req.getMembers())
                                    .flatMap(username ->
                                            getPublicKey(username, accessToken)
                                                    .<Map.Entry<String, String>>handle((publicKey, sink) -> {
                                                        try {
                                                            String cleanedKey = cleanPublicKey(publicKey);
                                                            String encrypted = encryptAESKeyWithRSA(aesKey, cleanedKey);
                                                            sink.next(Map.entry(username, encrypted));
                                                        } catch (Exception e) {
                                                            sink.error(new RuntimeException("Encryption failed for " + username, e));
                                                        }
                                                    })
                                    )
                                    .collectMap(Map.Entry::getKey, Map.Entry::getValue)
                                    .flatMap(encryptedKeys -> {
                                        ChatRoom newRoom = new ChatRoom();
                                        newRoom.setName(req.getName());
                                        newRoom.setMembers(req.getMembers());
                                        newRoom.setGroup(req.isGroup());
                                        newRoom.setEncryptedKeys(encryptedKeys);
                                        return chatRoomRepository.save(newRoom)
                                                .flatMap(savedRoom -> ServerResponse
                                                        .created(request.uriBuilder()
                                                                .path("/api/chatrooms/{id}")
                                                                .build(savedRoom.getId()))
                                                        .contentType(APPLICATION_JSON)
                                                        .bodyValue(toChatRoomDTO(savedRoom))
                                                );
                                    });
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

    private String generateRoomKey() {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }

    private String encryptAESKeyWithRSA(String aesKey, String base64PublicKey) throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(base64PublicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        OAEPParameterSpec oaepParams = new OAEPParameterSpec(
                "SHA-256", "MGF1", MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT
        );
        cipher.init(Cipher.ENCRYPT_MODE, publicKey, oaepParams);
        byte[] encrypted = cipher.doFinal(aesKey.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encrypted);
    }

    private String cleanPublicKey(String pemKey) {
        return pemKey
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
    }
}