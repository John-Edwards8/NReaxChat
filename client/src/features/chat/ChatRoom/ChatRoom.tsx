import ChatHeader from "./ChatHeader.tsx";
import MessagesList from "./MessagesList.tsx";
import ChatInput from "./ChatInput.tsx";
import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

function ChatRoom() {
    type Message = {
      text: string;
      sender: 'me' | 'other';
    };
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]); 
    const stompClientRef = useRef<Client>(null);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new WebSocket(WEBSOCKET_URL),
            reconnectDelay: 5000,
            debug: (str) => {
                console.log("DEBUG: ", str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/messages', (response) => {
                    console.log('Received message:', response.body);
                    const data = JSON.parse(response.body);
                    if (data.sender && data.content) {
                      setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                          text: data.content,
                          sender: data.sender === 'User1' ? 'me' : 'other'
                        }
                      ]);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
          stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        console.log("📤 Отправка сообщения:", message);
        const stompClient = stompClientRef.current;
        if (stompClient && stompClient.connected) {
          stompClient.publish({
            destination: "/app/sendMessage",
            body: JSON.stringify({
              senderName: "User1",
              content: message
            }),
          });
          setMessage('');
        } else {
          console.error('Stomp client is not connected');
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
