import ChatSidebarLeft from '../components/chat/SidebarLeft/ChatSidebarLeft'
import ChatRoom from '../components/chat/ChatRoom/ChatRoom'
import ChatSidebarRight from "../components/chat/SidebarRight/ChatSidebarRight";

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