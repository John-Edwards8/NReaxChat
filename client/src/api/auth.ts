import api from '../api/axios.ts'
import { AuthRequest } from "../types/AuthRequest";
import { AuthResponse } from "../types/AuthResponse";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('auth/api/login', credentials);
        const {accessToken, refreshToken, role} = response.data;
    
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
        localStorage.setItem('currentUser', credentials.username);
    
        return response.data;
    } catch (error: any) {
        const message = error.response.data || "Login failed";
        throw new Error(message);
    }
}

export const register = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('auth/api/register', credentials);
        return response.data;
    } catch (error: any) {
        const message = error.response.data || "Registration failed";
        throw new Error(message);
    }
}
