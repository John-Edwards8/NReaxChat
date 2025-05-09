import { useState } from 'react';
import ChatSearchBar from './ChatSearchBar'
import ChatSectionHeader from './ChatSectionHeader'
import ChatListItem from "./ChatListItem";
import { ChatTab} from "../../../types/ChatTabs";

function ChatSidebarLeft() {
    const [activeTab, setActiveTab] = useState<ChatTab>('all');

    return (
        <div className="w-[420px] rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col m-2 overflow-hidden">
            <ChatSearchBar/>
            <ChatSectionHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
            <ChatListItem activeTab={activeTab}/>
        </div>
    );
}

export default ChatSidebarLeft;
