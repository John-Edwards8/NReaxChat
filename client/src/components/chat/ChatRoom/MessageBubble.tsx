import MessageContextMenu from "./MessageContextMenu";
import { Message } from "../../../types/Message";
import React from "react";

type Props = Message & {
    currentUser: string;
    isGroup: boolean;
    setMessage: (val: string) => void;
    setEditingId: (val: string) => void;
    deleteMessage: (id: string) => void;
    contextMenu: { messageId: string; x: number; y: number } | null;
    openContextMenu: (id: string, e: React.MouseEvent) => void;
    closeContextMenu: () => void;
};

const MessageBubble = ({ id, content, sender, timestamp, currentUser, isGroup, setMessage, setEditingId, deleteMessage, contextMenu, openContextMenu, closeContextMenu }: Props) => {
    const isMe = sender === currentUser;
    const menuOpen = contextMenu?.messageId === id;

    return (
        <div className={`relative flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                <div
                    className={`
                        px-4 py-2 rounded-22
                        ${isMe ? "bg-blue-base rounded-br-none" : "bg-gray-800 rounded-bl-none"}
                        flex flex-col
                    `}
                    onContextMenu={isMe ? (e) => openContextMenu(id, e) : undefined}
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
                <div className="fixed z-50" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={closeContextMenu}>
                    <MessageContextMenu
                        isMine={isMe}
                        onCopy={() => { navigator.clipboard.writeText(content); closeContextMenu(); }}
                        onEdit={() => { setMessage(content); setEditingId(id); closeContextMenu(); }}
                        onForward={() => console.log('Forward')}
                        onReply={() => console.log('Reply')}
                        onDelete={() => { deleteMessage(id); closeContextMenu(); }}
                    />
                </div>
            )}
        </div>
    );
};

export default MessageBubble;