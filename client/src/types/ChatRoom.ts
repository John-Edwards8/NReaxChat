export interface ChatRoom {
    roomId: string;
    name: string;
    group: boolean;
    members: string[];
    encryptedKeys?: Record<string, string>;
}