import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import { useState } from 'react';
import { useChat } from "../../../hooks/useChat";
import { ChatRoom } from "../../../types/ChatRoom";

function Room(room : ChatRoom) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  }

  return(
    <div className="flex flex-col flex-1 rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] m-2 overflow-hidden">
        <ChatHeader
          {...room}
        />
        <MessagesList
          messages={messages}
        />
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={handleSend}
        />
    </div>
  );
}

export default Room;
