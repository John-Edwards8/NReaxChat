import { Message } from "../../../types/Message";

type Props = Message & { currentUser: string; isGroup: boolean };

const MessageBubble = ({ text, sender, timestamp, currentUser, isGroup }: Props) => {
    const isMe = sender === currentUser;
    
    return (
        <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                <div
                    className={`
                        px-4 py-2 rounded-22
                        ${isMe ? "bg-blue-base rounded-br-none" : "bg-gray-800 rounded-bl-none"}
                        flex flex-col
                    `}
                >
                    {!isMe && isGroup ? (
                        <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                            <div>{sender}</div>
                            <div className="whitespace-nowrap ml-5">
                                {timestamp.toLocaleString().match(/\d\d\:\d\d/i)?.[0]}
                            </div>
                        </div>
                    ) : null}
                    <div className="flex justify-between items-end gap-2">
                        {text}
                        {(!isGroup || isMe) && (
                            <div className="text-gray-400 text-xs whitespace-nowrap">
                                {timestamp.toLocaleString().match(/\d\d\:\d\d/i)?.[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;