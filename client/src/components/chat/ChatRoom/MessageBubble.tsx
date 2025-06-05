import MessageContextMenu from "./MessageContextMenu";
import {Message} from "../../../types/Message";
import { useContextMenu } from "../../../hooks/useContextMenu";

type Props = Message & {
    currentUser: string;
    isGroup: boolean;
    setMessage: (val: string) => void;
    setEditingId: (val: string) => void;
};

const MessageBubble = ({ id, content, sender, currentUser, isGroup, setMessage, setEditingId }: Props) => {
    const isMe = sender === currentUser;
    const { menuOpen, position, handleContextMenu, closeMenu } = useContextMenu();

    return (
        <div className={`relative flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}
             onContextMenu={isMe ? handleContextMenu : undefined}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                {!isMe && isGroup && (
                    <div className="text-xs text-gray-400 mb-1">{sender}</div>
                )}
                <div className={`px-4 py-2 rounded-22 ${isMe
                         ? "bg-blue-base rounded-br-none"
                         : "bg-gray-800 rounded-bl-none"
                     }`}
                >
                    {content}
                </div>
            </div>

            {menuOpen && isMe && (
                <div className="fixed z-50" style={{ top: position.y, left: position.x }} onClick={closeMenu}>
                    <MessageContextMenu
                        isMine={isMe}
                        onCopy={() => console.log('Copy')}
                        onEdit={() => { setMessage(content); setEditingId(id); closeMenu(); }}
                        onForward={() => console.log('Forward')}
                        onReply={() => console.log('Reply')}
                        onDelete={() => console.log('Delete')}
                    />
                </div>
            )}
        </div>
    );
};

export default MessageBubble;