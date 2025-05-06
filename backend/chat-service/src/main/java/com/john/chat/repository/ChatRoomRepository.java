package com.john.chat.repository;

import com.john.chat.model.ChatRoom;
import org.bson.types.ObjectId;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ChatRoomRepository extends ReactiveCrudRepository<ChatRoom, ObjectId> {
    Flux<ChatRoom> findByUser(ObjectId user1, ObjectId user2);
}
