import api from '../api/axios.ts'
import { AuthRequest } from "../types/AuthRequest";
import { AuthResponse } from "../types/AuthResponse";
import { useAuthStore } from "../stores/authStore";
import { NavigateFunction } from "react-router-dom";
import { generateKeyPair, exportPublicKeyToPem, exportPrivateKeyToPem, savePrivateKeyToLocalStorage, importPrivateKeyFromPem } from "../utils/crypto";

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('auth/api/login', credentials);
        const { accessToken, role } = response.data;

        useAuthStore.getState().setAccessToken(accessToken);
        useAuthStore.getState().setRole(role);
        useAuthStore.getState().setCurrentUser(credentials.username);

        if (!localStorage.getItem("privateKey")) {
            const userWithKey = await api.get(`/auth/api/users/${credentials.username}/key`)
            const { privateKey: privateKeyPem } = userWithKey.data;
            if (!privateKeyPem) throw new Error("Private key not found");
            const privateKey = await importPrivateKeyFromPem(privateKeyPem);
            await savePrivateKeyToLocalStorage(privateKey);
        }

        return response.data;
    } catch (error: any) {
        const message = error.response.data || "Login failed";
        throw new Error(message);
    }
}

export const register = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
        const { username, password } = credentials;
        const keyPair = await generateKeyPair();
        const publicKeyPem = await exportPublicKeyToPem(keyPair.publicKey);
        const privateKeyPem = await exportPrivateKeyToPem(keyPair.privateKey);
        await savePrivateKeyToLocalStorage(keyPair.privateKey);
        const response = await api.post<AuthResponse>('auth/api/register', {
            username, password, publicKey: publicKeyPem, privateKey: privateKeyPem
        });
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
        localStorage.removeItem("privateKey");
        useAuthStore.getState().clearAuth();
        if (navigate) navigate("/");
    }
}