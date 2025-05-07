import api from '../api/axios'
import { AuthRequest} from "../types/AuthRequest.ts";
import { AuthResponse} from "../types/AuthResponse.ts";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/api/login', credentials);
    const {accessToken, refreshToken, role} = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);

    return response.data;
}