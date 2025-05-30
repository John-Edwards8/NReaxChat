import { create } from 'zustand';
import { ChatRoom } from '../types/ChatRoom';
import api from '../api/axios';
import { useAuthStore } from "./authStore";

interface ChatRoomStore {
    rooms: ChatRoom[];
    activeRoom: ChatRoom | null;
    fetchRooms: () => Promise<void>;
    addRoom: (room: Omit<ChatRoom, 'id' | 'roomId'>) => Promise<void>;
    setActiveRoom: (name: string | null) => void;
}

export const useChatRoomStore = create<ChatRoomStore>((set, get) => ({
    rooms: [],
    activeRoom: null,

    setActiveRoom: (name) => {
        const room = get().rooms.find(r => r.name === name) ?? null;
        set({ activeRoom: room });
        if (room) {
            localStorage.setItem('lastRoom', room.name);
        } else {
            localStorage.removeItem('lastRoom');
        }
    },

    fetchRooms: async () => {
        try {
            const response = await api.get('/chat/api/chatrooms/me');
            const currentUser = useAuthStore.getState().currentUser;
            if (!currentUser) return;

            const validRooms = response.data.filter((room: ChatRoom) =>
                Array.isArray(room.members) &&
                room.members.includes(currentUser)
            );
            set({ rooms: validRooms });

            const last = localStorage.getItem('lastRoom');
            if (last) {
                const found = validRooms.find((r: { name: string; }) => r.name === last);
                if (found) set({ activeRoom: found });
            }
        } catch (err) {
            console.error('Failed to fetch chat rooms', err);
        }
    },

    addRoom: async (roomData) => {
        try {
            const response = await api.post('/chat/api/chatrooms', roomData);
            const newRoom: ChatRoom = response.data;
            set(state => ({ rooms: [...state.rooms, newRoom] }));
        } catch (err) {
            console.error('Failed to create chat room', err);
        }
    },
}));
