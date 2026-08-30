import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuthStore } from "../stores/authStore";
import { extractUsernameFromToken } from "../utils/jwt";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [initialized, setInitialized] = useState(false);
    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setCurrentUser = useAuthStore(state => state.setCurrentUser);
    const clearAuth = useAuthStore(state => state.clearAuth);

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const response = await api.post('/auth/api/refresh');
                const accessToken = response.data.accessToken;
                const user = extractUsernameFromToken(accessToken) ?? '';
                setAccessToken(accessToken);
                setCurrentUser(user); 
            } catch {
                clearAuth();
            } finally {
                setInitialized(true);
            }
        };
        tryRefresh();
    }, []);

    if (!initialized) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-2xl font-semibold text-white-700 animate-pulse">
                Loading...
            </div>
        </div>);
    }

    return <>{children}</>;
};
