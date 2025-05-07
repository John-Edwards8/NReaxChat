import api from '../api/axios.ts'
import { AuthRequest} from "../types/AuthRequest.ts";
import { AuthResponse} from "../types/AuthResponse.ts";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('auth/api/login', credentials);
    return response.data;
}