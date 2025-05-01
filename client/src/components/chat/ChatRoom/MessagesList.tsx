import MessageBubble from "./MessageBubble.tsx";

type Message = {
  text: string;
  sender: 'me' | 'other';
};

const MessagesList = ({messages} : {messages:Message[]}) => {
    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
            {messages.map((msg, index) => (
                <MessageBubble key={index} text={msg.text} sender={msg.sender as 'me' | 'other'} />
            ))}
        </div>
    );
};

export default MessagesList;
