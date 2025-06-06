import AppLogo from './AppLogo'
import AddRoom from './AddRoom'
import Settings from './Settings'

function ChatSidebarRight() {
    return (
        <div className="w-[320px] rounded-22 bg-[#0F172A]/50 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            <AppLogo/>
            <hr className="border-gray-300/30 m-2" />
            <AddRoom />
            <hr className="border-gray-300/30 m-2" />
            <div className="mt-auto">
                <hr className="border-gray-300/30 m-2" />
                <Settings/>
            </div>
        </div>
    );
}

export default ChatSidebarRight;
