import axios from "axios";
import { logger } from "../utils/logger";

const api = axios.create({
    baseURL: import.meta.env.VITE_GATEWAY_URL,
    withCredentials: true,
});

async function refreshToken() {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
        logger.error('Missing refresh token');
        throw new Error('Missing refresh token');
    }
    logger.info('Attempting to refresh access token...');
    const response = await api.post('auth/api/refresh', null, {
        headers: {Authorization: `Bearer ${refresh}`,},
    });
    logger.info('Token refreshed successfully');
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.accessToken;
}

const EXCLUDED_PATHS = ['/auth/api/login', '/auth/api/register'];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    const isExcluded = EXCLUDED_PATHS.some(path => config.url?.includes(path));
    if (!isExcluded && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    logger.debug(`[Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
});

api.interceptors.response.use((res) => {
        logger.debug(`[Response] ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url}`, res);
        return res;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem('refreshToken')) {
            logger.info('Trying to refresh token after 401...');
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (e) {
                logger.error('Token refresh failed. Logging out.', e);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;