import { ChatTabProps} from "../../../types/ChatTabs";
import { useChatRoomStore } from "../../../stores/chatRoomStore";
import { useAuthStore } from "../../../stores/authStore";

const ChatListItem = ({
    activeTab,
    search
}: Pick<ChatTabProps, 'activeTab'> & { search: string }) => {
    const { rooms, activeRoom, setActiveRoom } = useChatRoomStore();
    const currentUser = useAuthStore(state => state.currentUser);

    const filteredRooms = rooms.filter(room => {
        const name = !room.group && currentUser
            ? room.members.find(m => m !== currentUser) || room.name
            : room.name;

        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

        switch (activeTab) {
            case 'groups':
                return room.group && matchesSearch;
            case 'private':
                return !room.group && matchesSearch;
            case 'all':
            default:
                return matchesSearch;
        }
    });

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
                                ${isActive ? 'bg-chat-active' : 'bg-chat-inactive'}
                            `}
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                                {displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="font-semibold">{displayName}</div>
                                <div className="text-sm text-chat-subtitle">
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