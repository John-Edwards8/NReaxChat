import { useEffect } from 'react';
import ChatSidebarLeft from '../components/chat/SidebarLeft/ChatSidebarLeft';
import Room from '../components/chat/ChatRoom/Room';
import ChatSidebarRight from '../components/chat/SidebarRight/ChatSidebarRight';
import { useChatRoomStore } from '../stores/chatRoomStore';
import Hidden from '../components/chat/ChatRoom/Hidden';

function ChatPage() {
    const { activeRoom, fetchRooms } = useChatRoomStore();

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return (
        <div className="flex h-screen overflow-hidden gap-3 p-2">
            <ChatSidebarLeft />
            {activeRoom ? <Room {...activeRoom} /> : <Hidden />}
            <ChatSidebarRight />
        </div>
    );
}

export default ChatPage;
