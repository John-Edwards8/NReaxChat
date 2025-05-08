package com.john.chat.repository;

import com.john.chat.model.ChatRoom;
import org.bson.types.ObjectId;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatRoomRepository extends ReactiveCrudRepository<ChatRoom, ObjectId> {
    Flux<ChatRoom> findByMembersContaining(String member);
    Mono<ChatRoom> findByName(String name);
}
