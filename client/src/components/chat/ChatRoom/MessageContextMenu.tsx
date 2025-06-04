import ContextMenu from '../../ui/ContextMenu/ContextMenu';
import ContextMenuItem from '../../ui/ContextMenu/ContextMenuItem';
import { MessageActionProps } from '../../../types/MessageActions';
import { FiCopy, FiTrash2, FiEdit } from 'react-icons/fi';
import { TiArrowForwardOutline } from 'react-icons/ti';
import { RiReplyLine } from 'react-icons/ri';

export default function MessageContextMenu({ isMine, onCopy, onEdit, onForward, onReply, onDelete }: MessageActionProps) {
    return (
        <ContextMenu>
            <ContextMenuItem icon={<FiCopy />} label="Copy" onClick={onCopy} />
            <ContextMenuItem icon={<FiEdit />} label="Edit" onClick={onEdit} />
            <ContextMenuItem icon={<TiArrowForwardOutline />} label="Forward" onClick={onForward} disabled={!isMine}/>
            <ContextMenuItem icon={<RiReplyLine />} label="Reply" onClick={onReply} />
            <ContextMenuItem icon={<FiTrash2 />} label="Delete" danger onClick={onDelete} disabled={!isMine}/>
        </ContextMenu>
    );
}