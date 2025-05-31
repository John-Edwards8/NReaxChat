import { Message } from "../../../types/Message";

type Props = Message & { currentUser: string; isGroup: boolean };

const MessageBubble = ({ text, sender, currentUser, isGroup }: Props) => {
    const isMe = sender === currentUser;

    return (
        <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                {!isMe && isGroup && (
                    <div className="text-xs text-gray-400 mb-1">{sender}</div>
                )}
                <div
                    className={`
            px-4 py-2 rounded-22
            ${isMe ? "bg-blue-base rounded-br-none" : "bg-gray-800 rounded-bl-none"}
          `}
                >
                    {text}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;