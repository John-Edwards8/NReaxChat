import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuthStore } from "../stores/authStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const response = await api.post('/auth/api/refresh');
                useAuthStore.getState().setAccessToken(response.data.accessToken);
            } catch {
                useAuthStore.getState().clearAuth();
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
