import { create } from 'zustand';
import { ChatRoom } from '../types/ChatRoom';
import api from '../api/axios';
import { useAuthStore } from "./authStore";

interface ChatRoomStore {
    rooms: ChatRoom[];
    activeRoom: ChatRoom | null;
    fetchRooms: () => Promise<void>;
    addRoom: (room: Omit<ChatRoom, 'id'>) => Promise<void>;
    setActiveRoom: (id: string | null) => void;
}

export const useChatRoomStore = create<ChatRoomStore>((set, get) => ({
    rooms: [],
    activeRoom: null,

    setActiveRoom: (name) => {
        const room = get().rooms.find(r => r.name === name) || null;
        set({ activeRoom: room });
    },

    fetchRooms: async () => {
        try {
            const response = await api.get('/chat/api/chatrooms/me');
            const currentUser = useAuthStore.getState().currentUser;

            if(!currentUser) return;

            const validRooms = response.data.filter((room: ChatRoom) =>
                room.name.trim().length > 0 &&
                Array.isArray(room.members) &&
                room.members.length >= 2 &&
                room.members.includes(currentUser)
            );

            set({ rooms: validRooms });
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
