package main.java.com.john.chat.handler;

import main.java.com.john.chat.model.ChatUser;
import main.java.com.john.chat.repository.ChatUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class ChatUserHandler {

    @Autowired
    private ChatUserRepository userRepository;

    public Mono<ServerResponse> getUsers(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(userRepository.findAll(), ChatUser.class);
    }

    public Mono<ServerResponse> getUser(ServerRequest request) {
        String username = request.pathVariable("username");
        return userRepository.findByUsername(username)
                .flatMap(user -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(user))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> register(ServerRequest request) {
        return request.bodyToMono(ChatUser.class)
                .flatMap(r -> userRepository.findByUsername(r.getUsername())
                        .flatMap(u -> ServerResponse.badRequest().bodyValue("User already exists"))
                        .switchIfEmpty(userRepository.save(r)
                                .flatMap(savedUser -> ServerResponse.ok()
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .bodyValue(savedUser)
                                ))
                );
    }

    public Mono<ServerResponse> updateUser(ServerRequest request) {
        String username = request.pathVariable("username");
        return request.bodyToMono(ChatUser.class)
                .flatMap(r -> userRepository.findByUsername(username)
                        .flatMap(existingUser -> {
                            if (r.getUsername() != null) {
                                existingUser.setUsername(r.getUsername());
                            }
                            return userRepository.save(existingUser);
                        })
                        .flatMap(updatedUser -> ServerResponse.ok()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(updatedUser)
                        )
                )
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> deleteUser(ServerRequest request) {
        String username = request.pathVariable("username");
        return userRepository.findByUsername(username)
                .flatMap(user -> userRepository.delete(user)
                        .then(ServerResponse.noContent().build())
                )
                .switchIfEmpty(ServerResponse.notFound().build());
    }
}
