import AppLogo from './AppLogo'
import Settings from './Settings'

function ChatSidebarRight() {
    return (
        <div className="w-[320px] rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col m-2 overflow-hidden">
            <AppLogo/>
            <hr className="border-gray-300/30 m-2" />
            <Settings/>
            <hr className="border-gray-300/30 m-2" />
        </div>
    );
}

export default ChatSidebarRight;
