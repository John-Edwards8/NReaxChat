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
                response.data.map((msg: any) => formatMessage(msg))
        );
    });

    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onmessage = (event) => {
        console.log("📩 Получено сообщение:", event.data);
        try {
            const data = JSON.parse(event.data);
            const newMessage = formatMessage(data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch (e) {
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
    }, []);

    const sendMessage = (message: string) => {
        console.log("📤 Отправка сообщения:", message);
        if (ws.current?.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({
                sender: 'User1',
                content: message,
            });
            ws.current.send(payload);
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    return { messages, sendMessage };
}
