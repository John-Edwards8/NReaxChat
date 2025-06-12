import api from '../api/axios.ts'
import { AuthRequest } from "../types/AuthRequest";
import { AuthResponse } from "../types/AuthResponse";
import { useAuthStore } from "../stores/authStore";
import { NavigateFunction } from "react-router-dom";
import { generateKeyPair, exportPublicKeyToPem, exportPrivateKeyToLocalStorage } from "../utils/crypto";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('auth/api/login', credentials);
        const { accessToken, role } = response.data;

        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setRole(role);
        useAuthStore.getState().setCurrentUser(credentials.username);

        if (!localStorage.getItem("privateKey")) {
            const keyPair = await generateKeyPair();
            await exportPrivateKeyToLocalStorage(keyPair.privateKey);
            const publicKeyPem = await exportPublicKeyToPem(keyPair.publicKey);
            await api.post("auth/api/public-key", { publicKey: publicKeyPem }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
        }

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

export const logout = async (navigate?: NavigateFunction): Promise<void> => {
    try {
        await api.post("/auth/api/logout");
    } catch (e) {
        console.error("Logout error (API):", e);
    } finally {
        useAuthStore.getState().clearAuth();
        if (navigate) navigate("/");
    }
}