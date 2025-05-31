import { useEffect, useState, useRef } from "react";
import { Message } from "../types/Message";
import { formatMessage } from "../utils/formatMessage";
import { useAuthStore } from "../stores/authStore";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL as string;

export function useChat(roomId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!roomId) return;

        ws.current?.close();

        setMessages([]);

        const token = useAuthStore.getState().accessToken!;
        const socketUrl = `${WEBSOCKET_URL}/chat/room/${roomId}?token=${token}`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("WS connected to", socketUrl);
        ws.current.onmessage = e => {
            const raw = JSON.parse(e.data);
            const msg = formatMessage(raw);
            setMessages(prev => [...prev, msg]);
        };
        ws.current.onerror = err => console.error("WS error", err);

        return () => { ws.current?.close(); };
    }, [roomId]);

    const sendMessage = (text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ content: text }));
        } else {
            console.warn("WS not open yet:", ws.current?.readyState);
        }
    };

    return { messages, sendMessage };
}
