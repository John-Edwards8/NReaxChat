import React, { useEffect, useState } from "react";
import MessageContextMenu from "./MessageContextMenu";
import {Message} from "../../../types/Message";

type Props = Message & { currentUser: string; isGroup: boolean };

const MessageBubble = ({text, sender, currentUser, isGroup}: Props) => {
    const isMe = sender === currentUser;
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setMenuOpen(false);
        };

        if (menuOpen) {
            window.addEventListener("click", handleClickOutside);
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen]);

    const handleCloseMenu = () => setMenuOpen(false);

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
                    {text}
                </div>
            </div>

            {menuOpen && isMe && (
                <div className="fixed z-50"
                     style={{ top: menuPosition.y, left: menuPosition.x }}
                     onClick={handleCloseMenu}>
                    <MessageContextMenu
                        isMine={isMe}
                        onCopy={() => console.log('Copy')}
                        onEdit={() => console.log('Edit')}
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