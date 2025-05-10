import { create } from 'zustand';
import api from '../api/axios';
import { User } from '../types/User';

interface UserStore {
    users: string[];
    fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    fetchUsers: async () => {
        try {
            const response = await api.get<User[]>('/auth/api/users');
            const nonAdminUsernames = response.data
                .filter(user => user.role !== 'ADMIN')
                .map(user => user.username)
                .filter(user => user !== localStorage.getItem("currentUser"));
            set({ users: nonAdminUsernames });
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    },
}));
