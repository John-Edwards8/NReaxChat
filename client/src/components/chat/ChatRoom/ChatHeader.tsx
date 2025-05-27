import { ChatRoom } from "../../../types/ChatRoom";

const ChatHeader = ({ name, group, members }: ChatRoom) => {
    return (
        <div className="flex items-center gap-3 p-2 bg-blue-base">
            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
                <div className="font-semibold">{name}</div>
                {group && <div className="text-sm">{members.length} members</div>}
            </div>
        </div>
    );
};

export default ChatHeader;