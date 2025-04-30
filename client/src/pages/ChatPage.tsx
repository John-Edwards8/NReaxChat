import ChatSidebarLeft from '../features/chat/SidebarLeft/ChatSidebarLeft'
import ChatRoom from '../features/chat/ChatRoom/ChatRoom.tsx'
import ChatSidebarRight from "../features/chat/SidebarRight/ChatSidebarRight.tsx";

function ChatPage() {
    return(
        <div className="flex h-screen overflow-hidden">
            <ChatSidebarLeft/>
            <ChatRoom/>
            <ChatSidebarRight />
        </div>
    )
}

export default ChatPage;