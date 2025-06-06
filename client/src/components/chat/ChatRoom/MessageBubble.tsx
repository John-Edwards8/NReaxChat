import MessageContextMenu from "./MessageContextMenu";
import {Message} from "../../../types/Message";
import { useContextMenu } from "../../../hooks/useContextMenu";

type Props = Message & {
    currentUser: string;
    isGroup: boolean;
    setMessage: (val: string) => void;
    setEditingId: (val: string) => void;
    deleteMessage: (id: string) => void;
};

const MessageBubble = ({ id, content, sender, timestamp, currentUser, isGroup, setMessage, setEditingId, deleteMessage }: Props) => {
    const isMe = sender === currentUser;
    const { menuOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className={`relative flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
             onContextMenu={isMe ? handleContextMenu : undefined}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                <div
                    className={`
                        px-4 py-2 rounded-22
                        ${isMe ? "bg-blue-base rounded-br-none" : "bg-gray-800 rounded-bl-none"}
                        flex flex-col
                    `}
                >
                    {!isMe && isGroup ? (
                        <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                            <div>{sender}</div>
                            <div className="whitespace-nowrap ml-5">
                                {timestamp.toLocaleString().match(/\d\d\:\d\d/i)?.[0]}
                            </div>
                        </div>
                    ) : null}
                    <div className="flex justify-between items-end gap-2">
                        {content}
                        {(!isGroup || isMe) && (
                            <div className="text-gray-400 text-xs whitespace-nowrap">
                                {timestamp.toLocaleString().match(/\d\d\:\d\d/i)?.[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {menuOpen && isMe && (
                <div className="fixed z-50" style={{ top: position.y, left: position.x }} onClick={closeMenu}>
                    <MessageContextMenu
                        isMine={isMe}
                        onCopy={() => { navigator.clipboard.writeText(content); closeMenu(); }}
                        onEdit={() => { setMessage(content); setEditingId(id); closeMenu(); }}
                        onForward={() => console.log('Forward')}
                        onReply={() => console.log('Reply')}
                        onDelete={() => { deleteMessage(id); closeMenu(); }}
                    />
                </div>
            )}
        </div>
    );
};

export default MessageBubble;