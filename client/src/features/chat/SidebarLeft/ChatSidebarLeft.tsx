import ChatSearchBar from './ChatSearchBar'
import ChatSectionHeader from './ChatSectionHeader'
import ChatListItem from "./ChatListItem.tsx";

function ChatSidebarLeft() {
    return (
        <div className="w-[420px] rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col m-2 overflow-hidden">
            <ChatSearchBar/>
            <ChatSectionHeader/>
            <ChatListItem/>
        </div>
    );
}

export default ChatSidebarLeft;
