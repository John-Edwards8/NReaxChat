import api from '../axios.ts';
import { ChatRoom } from "../../types/ChatRoom";

export const getAllChatRooms = async (): Promise<ChatRoom[]> => {
    const response = await api.get('/chat/api/chatrooms');
    return response.data;
}