import ChatSidebarLeft from '../components/chat/SidebarLeft/ChatSidebarLeft'
import Room from '../components/chat/ChatRoom/Room'
import ChatSidebarRight from "../components/chat/SidebarRight/ChatSidebarRight";
import { useChatRoomStore } from '../stores/chatRoomStore';

function ChatPage() {
    const { activeRoom } = useChatRoomStore();

    return(
        <div className="flex h-screen overflow-hidden">
            <ChatSidebarLeft/>
            {activeRoom && <Room {...activeRoom}/>}
            <ChatSidebarRight />
        </div>
    )
}

export default ChatPage;