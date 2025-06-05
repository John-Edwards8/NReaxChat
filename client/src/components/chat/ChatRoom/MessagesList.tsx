import MessageBubble from "./MessageBubble";
import { Message } from "../../../types/Message";

interface Props {
    messages: Message[];
    currentUser: string;
    isGroup: boolean;
}

const MessagesList = ({ messages, currentUser, isGroup }: Props) => {
    let lastDate = "";

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
            {messages.map((msg, idx) => {
            const dateParts = msg.timestamp.toLocaleString().match(/^(\d{4})-(\d{2})-(\d{2})/)?.slice(1) || "";
            const dateStr = dateParts.length === 3
                    ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
                    : "";

            const showDateSeparator = dateStr !== lastDate;
            lastDate = dateStr;

            return (
                <div key={idx}>
                {showDateSeparator && (
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-white opacity-20" />
                            <span className="mx-4 text-white text-xs">{dateStr}</span>
                        <div className="flex-grow h-px bg-white opacity-20" />
                    </div>
                )}
                <MessageBubble
                    text={msg.text}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    currentUser={currentUser}
                    isGroup={isGroup}
                />
                </div>
            );
            })}
        </div>
    );
};

export default MessagesList;
