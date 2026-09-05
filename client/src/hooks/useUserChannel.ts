import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useChatRoomStore } from "../stores/chatRoomStore";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL as string;

export const useUserChannel = () => {
    const accessToken = useAuthStore(state => state.accessToken);
    const currentUser = useAuthStore(state => state.currentUser);
    const receiveRoom = useChatRoomStore(state => state.receiveRoom);

    useEffect(() => {
        if (!currentUser || !accessToken) return;

        const socketUrl = `${WEBSOCKET_URL}/chat/user/${currentUser}?token=${accessToken}`;
        const ws = new WebSocket(socketUrl);

        ws.onmessage = (e) => {
            const raw = JSON.parse(e.data);
            if (raw.type === "CHAT_ROOM_CREATED") {
                receiveRoom(raw.data);
            }
        };

        ws.onerror = (err) => console.error("User channel WS error", err);

        return () => ws.close();
    }, [currentUser, accessToken]);
};