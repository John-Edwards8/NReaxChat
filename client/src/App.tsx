//import { useState } from 'react';
import ChatSidebarLeft from './features/chat/SidebarLeft/ChatSidebarLeft'
//import ChatRoom from './features/chat/ChatRoom'
import ChatRoom from './features/chat/ChatRoom/ChatRoom.tsx'
import ChatSidebarRight from "./features/chat/SidebarRight/ChatSidebarRight.tsx";

//import LoginPage from './LoginPage';

function App() {
    // const [token, setToken] = useState(null);

    // if (!token) {
    //   return <LoginPage setToken={setToken}/>
    // }

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <ChatSidebarLeft/>
                <ChatRoom/>
                <ChatSidebarRight />
            </div>
        </>
    )
}

export default App
