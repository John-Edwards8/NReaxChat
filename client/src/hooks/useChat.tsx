import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Message } from "../types/Message";
import { formatMessage } from "../utils/formatMessage";
import { useAuthStore } from "../stores/authStore";
import { updateMessage, deleteMessage } from "../api/messages";
import { decryptRoomKey } from "../utils/crypto";
import { encryptWithKey, decryptWithKey } from "../utils/crypto";
import api from "../api/axios";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL as string;
const POLLING_INTERVAL = 500;

const useChat = (roomId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useRef<WebSocket | null>(null);
    const pollingIntervalId = useRef<NodeJS.Timeout | null>(null);
    const lastMessageIdRef = useRef<string | null>(null);
    const [roomKey, setRoomKey] = useState<string | null>(null);

    const fetchMessages = async () => {
        try {
            const token = useAuthStore.getState().accessToken!;
            const response = await axios.get(`/api/messages`, {
                params: {
                    roomId,
                    afterId: lastMessageIdRef.current,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const newMessages: Message[] = response.data;
            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
                lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
            }
        } catch (err) {
            console.error("Polling fetch messages failed:", err);
        }
    };

    useEffect(() => {
        const fetchRoomKey = async () => {
            try {
                const token = useAuthStore.getState().accessToken!;
                const currentUser = useAuthStore.getState().currentUser!;
                const response = await api.get(`chat/api/chatrooms/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const encryptedKey = response.data.encryptedKeys?.[currentUser];
                if (encryptedKey) {
                    const decryptedKey = await decryptRoomKey(encryptedKey);
                    setRoomKey(decryptedKey);
                } else {
                    console.warn("No encrypted key found for current user in this room");
                }
            } catch (err) {
                console.error("Failed to fetch/decrypt AES key for room:", err);
            }
        };

        if (roomId) {
            setRoomKey(null);
            fetchRoomKey();
        }
    }, [roomId]);

    useEffect(() => {
        if (!roomId || !roomKey) return;

        ws.current?.close();
        setMessages([]);
        lastMessageIdRef.current = null;

        const token = useAuthStore.getState().accessToken!;
        const socketUrl = `${WEBSOCKET_URL}/chat/room/${roomId}?token=${token}`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log("WS connected to", socketUrl);

            if (pollingIntervalId.current) {
                clearInterval(pollingIntervalId.current);
                pollingIntervalId.current = null;
            }
        };

        ws.current.onmessage = e => {
            const raw = JSON.parse(e.data);
            const { cipher, iv } = JSON.parse(raw.content);
            raw.content = decryptWithKey(cipher, iv, roomKey);
            const msg = formatMessage(raw);
            setMessages(prev => [...prev, msg]);
            lastMessageIdRef.current = msg.id;
        };

        ws.current.onerror = err => {
            console.error("WS error", err);

            if (!pollingIntervalId.current) {
                fetchMessages();
                pollingIntervalId.current = setInterval(fetchMessages, POLLING_INTERVAL);
            }
        };

        ws.current.onclose = () => {
            console.log("WS closed");

            if (!pollingIntervalId.current) {
                fetchMessages();
                pollingIntervalId.current = setInterval(fetchMessages, POLLING_INTERVAL);
            }
        };

        pollingIntervalId.current = setInterval(fetchMessages, POLLING_INTERVAL);

        return () => {
            ws.current?.close();
            if (pollingIntervalId.current) {
                clearInterval(pollingIntervalId.current);
                pollingIntervalId.current = null;
            }
        };
    }, [roomId, roomKey]);

    const sendMessage = (text: string) => {
        if (ws.current?.readyState === WebSocket.OPEN && roomKey) {
            const { cipher, iv } = encryptWithKey(text, roomKey);
            ws.current.send(JSON.stringify({ content: JSON.stringify({ cipher, iv }) }));
        } else {
            console.warn("WS not open yet:", ws.current?.readyState);
        }
    };

    const editMessage = async (id: string, newContent: string) => {
        try {
            if (!roomKey) throw new Error("No roomKey available for encryption");
            const { cipher, iv } = encryptWithKey(newContent, roomKey);
            const encrypted = JSON.stringify({ cipher, iv });
            const response = await updateMessage(id, encrypted);
            const updated = response.data;
            const parsed = JSON.parse(updated.content);
            const decrypted = decryptWithKey(parsed.cipher, parsed.iv, roomKey);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === id ? { ...msg, content: decrypted } : msg
                )
            );
        } catch (err) {
            console.error("Failed to update message:", err);
        }
    };

    const removeMessage = async (id: string) => {
        try {
            await deleteMessage(id);
            setMessages(prev => prev.filter(msg => msg.id !== id));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    return { messages, sendMessage, editMessage, removeMessage };
}

export default useChat;