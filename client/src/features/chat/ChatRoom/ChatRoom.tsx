import ChatHeader from "./ChatHeader.tsx";
import MessagesList from "./MessagesList.tsx";
import ChatInput from "./ChatInput.tsx";
import { useState, useEffect } from 'react';
import axios from "axios";

function ChatRoom() {
    type Message = {
      text: string;
      sender: 'me' | 'other';
    };
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]); 
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
      axios.get(GATEWAY_URL + "/chat/messages").then(response => {
        setMessages(
          response.data.map((msg: any) => ({
            text: msg.content || msg.text || msg,
            sender: msg.sender === 'User1' ? 'me' : 'other',
          }))
        );
      });

      const socket = new WebSocket(WEBSOCKET_URL);
      setWs(socket);

      socket.onmessage = (event) => {
        console.log("📩 Получено сообщение:", event.data);
        try {
          const data = JSON.parse(event.data);
          const newMessage: Message = {
            text: data.content || data.text || String(data),
            sender: data.sender === 'User1' ? 'me' : 'other',
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
        } catch (e) {
          setMessages(prevMessages => [...prevMessages, {
            text: event.data,
            sender: 'other'
          }]);
        }
      }

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        socket.close();
      };
    }, []);

    const sendMessage = () => {
      console.log("📤 Отправка сообщения:", message);
      if (ws && ws.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({
          sender: 'User1',
          content: message,
        });
        ws.send(payload);
        setMessages(prevMessages => [...prevMessages, { text: message, sender: 'me' }]);
        setMessage('');
      } else {
        console.error("WebSocket is not connected.");
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
                sendMessage={sendMessage}
            />
        </div>
    );
}

export default ChatRoom;
