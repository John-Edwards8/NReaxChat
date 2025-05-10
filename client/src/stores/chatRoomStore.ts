import { create } from 'zustand';
import { ChatRoom } from '../types/ChatRoom';
import api from '../api/axios';

interface ChatRoomStore {
    rooms: ChatRoom[];
    fetchRooms: () => Promise<void>;
    addRoom: (room: Omit<ChatRoom, 'id'>) => Promise<void>;
}

export const useChatRoomStore = create<ChatRoomStore>((set) => ({
    rooms: [],
    fetchRooms: async () => {
        try {
            const response = await api.get('/chat/api/chatrooms');
            set({ rooms: response.data });
        } catch (err) {
            console.error('Failed to fetch chat rooms', err);
        }
    },
    addRoom: async (roomData) => {
        try {
            const response = await api.post('/chat/api/chatrooms', roomData);
            const newRoom: ChatRoom = response.data;
            set((state) => ({ rooms: [...state.rooms, newRoom] }));
        } catch (err) {
            console.error('Failed to create chat room', err);
        }
    },
}));
