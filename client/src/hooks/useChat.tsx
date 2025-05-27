import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Message } from "../types/Message";
import { formatMessage } from "../utils/formatMessage";

export function useChat() {
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const [messages, setMessages] = useState<Message[]>([]); 
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        api.get('/chat/messages').then(response => {
            setMessages(
                response.data.map((msg: Message) => formatMessage(msg))
        );
    });

    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onmessage = (event) => {
        console.log("📩 Получено сообщение:", event.data);
        try {
            const data = JSON.parse(event.data);
            const newMessage = formatMessage(data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch {
            setMessages(prevMessages => [...prevMessages, {
                text: event.data,
                sender: 'other'
            }]);
        }
    }

    ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return () => {
        ws.current?.close();
    };
    }, [WEBSOCKET_URL]);

    const sendMessage = (message: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({
                sender: 'User1',
                content: message,
            });
            console.log("📤 Отправка сообщения:", payload);
            ws.current.send(payload);
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    return { messages, sendMessage };
}
