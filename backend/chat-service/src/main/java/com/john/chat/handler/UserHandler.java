package main.java.com.john.chat.handler;

import com.john.chat.model.User;
import com.john.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class UserHandler {

    @Autowired private UserRepository userRepository;

    public Mono<ServerResponse> getUsers(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(userRepository.findAll(), User.class);
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
        return request.bodyToMono(User.class)
                .flatMap(r -> userRepository.findByUsername(r.getUsername())
                        .flatMap(u -> ServerResponse.badRequest().bodyValue("User already exists"))
                        .switchIfEmpty(Mono.defer(() -> {
                            r.setRole("ROLE_USER");
                            return userRepository.save(r)
                                    .flatMap(savedUser -> ServerResponse.ok()
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .bodyValue(savedUser)
                                    );
                        }))
                );
    }

    public Mono<ServerResponse> updateUser(ServerRequest request) {
        String username = request.pathVariable("username");
        return request.bodyToMono(User.class)
                .flatMap(r -> userRepository.findByUsername(username)
                        .flatMap(existingUser -> {
                            if (r.getUsername() != null) existingUser.setUsername(r.getUsername());
                            if (r.getPassword() != null) existingUser.setPassword(r.getPassword());
                            if (r.getRole() != null) existingUser.setRole(r.getRole());
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