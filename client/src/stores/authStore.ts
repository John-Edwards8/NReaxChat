import { create } from 'zustand';

interface AuthStore {
    role: string | null;
    accessToken: string | null;
    currentUser: string | null;
    setAccessToken: (token: string) => void;
    setCurrentUser: (user: string) => void;
    setRole: (role: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    role: null,
    accessToken: null,
    currentUser: null,
    setAccessToken: (token) => set({ accessToken: token }),
    setCurrentUser: (user) => set({ currentUser: user }),
    setRole: (role) => set({ role }),
    clearAuth: () => set({ accessToken: null, role: null, currentUser: null }),
}));