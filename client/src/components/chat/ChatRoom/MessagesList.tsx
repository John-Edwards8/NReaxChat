import MessageBubble from "./MessageBubble";
import { Message } from "../../../types/Message";

interface Props {
    messages: Message[];
    currentUser: string;
    isGroup: boolean;
    setMessage: (val: string) => void;
    setEditingId: (val: string) => void;
    deleteMessage: (id: string) => void;
}

const MessagesList = ({ messages, currentUser, isGroup, setMessage, setEditingId, deleteMessage }: Props) => (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
        {messages.map((msg) => (
            <MessageBubble
                key={String(msg.id)}
                id={msg.id}
                content={msg.content}
                sender={msg.sender}
                currentUser={currentUser}
                isGroup={isGroup}
                setMessage={setMessage}
                setEditingId={setEditingId}
                deleteMessage={deleteMessage}
            />
        ))}
    </div>
);

export default MessagesList;
