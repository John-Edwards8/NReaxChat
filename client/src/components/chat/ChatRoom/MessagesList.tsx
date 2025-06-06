import MessageBubble from "./MessageBubble";
import { Message } from "../../../types/Message";
import { useContextMenu } from '../../../hooks/useContextMenu';

interface Props {
    messages: Message[];
    currentUser: string;
    isGroup: boolean;
    setMessage: (val: string) => void;
    setEditingId: (val: string) => void;
    deleteMessage: (id: string) => void;
}

const MessagesList = ({ messages, currentUser, isGroup, setMessage, setEditingId, deleteMessage }: Props) => {
    const { contextMenu, openContextMenu, closeContextMenu, menuRef } = useContextMenu();
    let lastDate = "";

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
            {messages.map((msg) => {
            const dateParts = msg.timestamp.toLocaleString().match(/^(\d{4})-(\d{2})-(\d{2})/)?.slice(1) || "";
            const dateStr = dateParts.length === 3
                    ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
                    : "";

            const showDateSeparator = dateStr !== lastDate;
            lastDate = dateStr;

            return (
                <div key={String(msg.id)}>
                {showDateSeparator && (
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-white opacity-20" />
                            <span className="mx-4 text-white text-xs">{dateStr}</span>
                        <div className="flex-grow h-px bg-white opacity-20" />
                    </div>
                )}
                <MessageBubble
                    id={msg.id}
                    content={msg.content}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    currentUser={currentUser}
                    isGroup={isGroup}
                    setMessage={setMessage}
                    setEditingId={setEditingId}
                    deleteMessage={deleteMessage}
                    contextMenu={contextMenu}
                    openContextMenu={openContextMenu}
                    closeContextMenu={closeContextMenu}
                    menuRef={menuRef}
                />
                </div>
            );
            })}
        </div>
    );
};

export default MessagesList;
