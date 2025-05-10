import { useEffect, useState } from "react";
import { ChatTabProps} from "../../../types/ChatTabs";
import { useChatRoomStore } from "../../../stores/chatRoomStore";

const ChatListItem = ({ activeTab }: Pick<ChatTabProps, 'activeTab'>) => {
    const { rooms, fetchRooms } = useChatRoomStore();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

    const filteredRooms = rooms.filter(room =>
        activeTab === 'groups' ? room.group : true
    );

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    return (
        <div className="flex-1 overflow-y-auto p-2 m-1">
            <ul className="space-y-2">
                {filteredRooms.map((room) => (
                    <li
                        key={room.name}
                        onClick={() => setActiveRoomId(room.name)}
                        className={`flex items-start gap-3 p-3 rounded-22 cursor-pointer transition hover:opacity-90
                          ${room.name === activeRoomId ? 'bg-chat-active' : 'bg-blue-base'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                            {room.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold">{room.name}</div>
                            <div className="text-sm text-gray-300">
                                {room.group ? 'Group Chat' : 'Private Chat'}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatListItem;