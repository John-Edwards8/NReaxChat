import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";
import { useState } from 'react';
import { useChat } from "../../../hooks/useChat";

function ChatRoom() {
  const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;
  const [message, setMessage] = useState('');
  
  const { messages, sendMessage } = useChat(GATEWAY_URL, WEBSOCKET_URL);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  }

  return(
    <div className="flex flex-col flex-1 rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] m-2 overflow-hidden">
        <ChatHeader/>
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

export default ChatRoom;
