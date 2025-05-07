import api from '../api/axios.ts'
import { AuthRequest } from "../types/AuthRequest";
import { AuthResponse } from "../types/AuthResponse";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/api/login', credentials);
    const {accessToken, refreshToken, role} = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);

    return response.data;
}