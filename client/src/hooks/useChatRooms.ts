import { useEffect, useState } from 'react';
import { getAllChatRooms } from '../api/services/ChatRoom';
import { ChatRoom } from '../types/ChatRoom';
import { logger } from "../utils/logger";

export const useChatRooms = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        getAllChatRooms()
            .then(setChatRooms)
            .catch(logger.error);
    }, []);

    return chatRooms;
}