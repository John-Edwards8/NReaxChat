import { useEffect } from "react";
import { ChatTabProps} from "../../../types/ChatTabs";
import { useChatRoomStore } from "../../../stores/chatRoomStore";
import { useAuthStore } from "../../../stores/authStore";

const ChatListItem = ({ activeTab }: Pick<ChatTabProps, 'activeTab'>) => {
    const { rooms, activeRoom, fetchRooms, setActiveRoom } = useChatRoomStore();
    const currentUser = useAuthStore(state => state.currentUser);

    const filteredRooms = rooms.filter(room => {
        switch (activeTab) {
            case 'groups':
                return room.group;
            case 'private':
                return !room.group;
            case 'all':
            default:
                return true;
        }
    });

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const getDisplayName = (room: typeof rooms[number]) => {
        if (!room.group && currentUser) {
            return room.members.find(m => m !== currentUser) || room.name;
        }
        return room.name;
    };

    return (
        <div className="flex-1 overflow-y-auto p-2 m-1">
            <ul className="space-y-2">
                {filteredRooms.map(room => {
                    const displayName = getDisplayName(room);
                    const isActive = activeRoom?.name === room.name;

                    return (
                        <li
                            key={room.name}
                            onClick={() => setActiveRoom(room.name)}
                            className={`
                                flex items-start gap-3 p-3 rounded-22 
                                cursor-pointer transition hover:opacity-90
                                ${isActive ? 'bg-chat-active' : 'bg-blue-base'}
                            `}
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                                {displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="font-semibold">{displayName}</div>
                                <div className="text-sm text-gray-300">
                                    {room.group ? 'Group Chat' : 'Private Chat'}
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatListItem;