import AppLogo from './AppLogo'
import AddRoom from './AddRoom'
import Settings from './Settings'
import Exit from "./Exit";

function ChatSidebarRight() {
    return (
        <div className="w-[320px] rounded-22 bg-container shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
            <AppLogo/>
            <hr className="h-px border-0 bg-separator m-2" />
            <AddRoom />
            <hr className="h-px border-0 bg-separator m-2" />
            <div className="mt-auto mb-2">
                <hr className="h-px border-0 bg-separator m-2" />
                <Settings/>
                <hr className="h-px border-0 bg-separator m-2" />
                <Exit/>
            </div>
        </div>
    );
}

export default ChatSidebarRight;
