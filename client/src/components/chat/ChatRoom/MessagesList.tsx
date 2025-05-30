import MessageBubble from "./MessageBubble";
import { Message } from "../../../types/Message";

interface Props {
    messages: Message[];
    currentUser: string;
    isGroup: boolean;
}

const MessagesList = ({ messages, currentUser, isGroup }: Props) => (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
        {messages.map((msg, idx) => (
            <MessageBubble
                key={idx}
                text={msg.text}
                sender={msg.sender}
                currentUser={currentUser}
                isGroup={isGroup}
            />
        ))}
    </div>
);

export default MessagesList;
