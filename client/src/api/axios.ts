import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_GATEWAY_URL,
    withCredentials: true,
});

const EXCLUDED_PATHS = ['/auth/api/login', '/auth/api/register'];

api.interceptors.request.use(async (config) => {    
    const isExcluded = EXCLUDED_PATHS.some(path => config.url?.includes(path));

    if (!isExcluded && useAuthStore.getState().accessToken) {
        config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
    }
    
    return config;
});

api.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await api.post('/auth/api/refresh');
                useAuthStore.getState().setAccessToken(response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
                return api(originalRequest);
            } catch (e) {
                useAuthStore.getState().clearAuth();
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;