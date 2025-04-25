import ChatHeader from "./ChatHeader.tsx";
import MessagesList from "./MessagesList.tsx";
import ChatInput from "./ChatInput.tsx";

function ChatRoom() {
    return(
        <div className="flex flex-col flex-1 rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] m-2 overflow-hidden">
            <ChatHeader/>
            <MessagesList/>
            <ChatInput/>
        </div>
    );
}

export default ChatRoom;
