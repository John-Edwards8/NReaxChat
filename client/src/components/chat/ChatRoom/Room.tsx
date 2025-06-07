import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import { useState } from "react";
import useChat from "../../../hooks/useChat";
import { ChatRoom } from "../../../types/ChatRoom";
import { useAuthStore } from "../../../stores/authStore";

export default function Room({ roomId, name, group, members }: ChatRoom) {
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { messages, sendMessage, editMessage, removeMessage } = useChat(roomId);
    const currentUser = useAuthStore((s) => s.currentUser!);

    const handleSend = () => {
        if (!message.trim()) return;
        if (editingId) {
            editMessage(editingId, message);
            setEditingId(null);
        } else {
            sendMessage(message);
        }
        setMessage("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setMessage('');
    };

    return (
        <div className="flex flex-col flex-1 rounded-22 bg-container shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden">
            <ChatHeader roomId={roomId} name={name} group={group} members={members}/>
            <MessagesList
                messages={messages}
                currentUser={currentUser}
                isGroup={group}
                setMessage={setMessage}
                setEditingId={setEditingId}
                deleteMessage={removeMessage}
            />
            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={handleSend}
                editingId={editingId}
                cancelEdit={cancelEdit}
            />
        </div>
    );
}