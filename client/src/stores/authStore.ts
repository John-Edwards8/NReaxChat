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

export const useAuthStore = create<AuthStore>()((set) => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('role');

    return {
        role: savedRole,
        accessToken: savedToken,
        currentUser: savedUser,
        setAccessToken: (token) => {
            localStorage.setItem('accessToken', token);
            set({ accessToken: token });
        },
        setCurrentUser: (user) => {
            localStorage.setItem('currentUser', user);
            set({ currentUser: user });
        },
        setRole: (role) => {
            localStorage.setItem('role', role);
            set({ role });
        },
        clearAuth: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('role');
            set({ accessToken: null, role: null, currentUser: null });
        },
    };
});
