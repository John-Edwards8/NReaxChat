import { ChatRoom } from "../../../types/ChatRoom";
import { useAuthStore } from '../../../stores/authStore';

const ChatHeader = ({ name, group, members }: ChatRoom) => {
    const currentUser = useAuthStore((state) => state.currentUser);

    const displayName =
        !group && currentUser
            ? members.find((u) => u !== currentUser) || name
            : name;

    return (
        <div className="flex items-center gap-3 p-2 bg-panel">
            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
                <div className="font-semibold">{displayName}</div>
                {group && <div className="text-sm">{members.length} members</div>}
            </div>
        </div>
    );
};

export default ChatHeader;