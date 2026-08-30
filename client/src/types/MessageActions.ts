export interface MessageActionProps {
    isMine: boolean;
    onCopy: () => void;
    onEdit: () => void;
    onForward: () => void;
    onReply: () => void;
    onDelete: () => void;
}