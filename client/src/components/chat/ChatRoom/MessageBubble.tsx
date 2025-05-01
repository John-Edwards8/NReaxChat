import { Message } from "../../../types/Message";

const MessageBubble = ({text, sender}: Message) => {
    const isMe = sender === 'me';

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
            <div
                className={`
                    max-w-[70%] px-4 py-2 rounded-22
                    ${isMe ? 'bg-blue-base rounded-br-none' : 'bg-gray-800 rounded-bl-none'}
                `}
            >
                {text}
            </div>
        </div>
    );
};

export default MessageBubble;