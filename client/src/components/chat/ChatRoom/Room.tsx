import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import { useState } from "react";
import { useChat } from "../../../hooks/useChat";
import { ChatRoom } from "../../../types/ChatRoom";
import { useAuthStore } from "../../../stores/authStore";

export default function Room({ roomId, name, group, members }: ChatRoom) {
    const [message, setMessage] = useState("");
    const { messages, sendMessage } = useChat(roomId);
    const currentUser = useAuthStore((s) => s.currentUser!);

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessage(message);
        setMessage("");
    };

    return (
        <div className="flex flex-col flex-grow flex-shrink-0 min-w-0 rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] overflow-hidden">
            <ChatHeader roomId={roomId} name={name} group={group} members={members}/>
            <MessagesList
                messages={messages}
                currentUser={currentUser}
                isGroup={group}
            />
            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={handleSend}
            />
        </div>
    );
}