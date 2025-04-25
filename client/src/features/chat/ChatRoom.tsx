import { useEffect, useState, useRef } from "react";
import './ChatRoom.css'
import HandleInput from "../../components/HandleInput.tsx";
import { Client } from '@stomp/stompjs';
import Messages from "../../components/Messages.tsx";

function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); 
  const stompClientRef = useRef<Client>(null);

  useEffect(() => {
    const stompClient = new Client({
        webSocketFactory: () => new WebSocket('ws://localhost:8080/chat'),
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
                  setMessages((prevMessages) => [...prevMessages, `${data.sender}: ${data.content}`]);
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

  return (
    <>
      <div className="card">
        <div className="chat-header">Chat</div>
        <div className="chat-window">
          <Messages 
            messages={messages}
          />
        </div>
        <div className="chat-input">
          <HandleInput
            message={message}
            setMessage={setMessage}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
        
      </div>
    </>
  )
}

export default ChatRoom
