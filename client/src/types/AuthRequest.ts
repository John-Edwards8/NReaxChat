export interface AuthRequest {
    username: string;
    password: string;
    publicKey?: string;
    privateKey?: string;
}