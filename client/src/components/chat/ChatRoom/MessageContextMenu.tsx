import ContextMenu from '../../ui/ContextMenu/ContextMenu';
import ContextMenuItem from '../../ui/ContextMenu/ContextMenuItem';
import { MessageActionProps } from '../../../types/MessageActions';
import { FiCopy, FiTrash2, FiEdit } from 'react-icons/fi';
import { TiArrowForwardOutline } from 'react-icons/ti';
import { RiReplyLine } from 'react-icons/ri';
import { useI18n } from '../../../i18n/I18nContext';

export default function MessageContextMenu({ isMine, onCopy, onEdit, onForward, onReply, onDelete }: MessageActionProps) {
    const { t } = useI18n();
    return (
        <ContextMenu>
            <ContextMenuItem icon={<FiCopy />} label={t("mcm.copy")} onClick={onCopy} />
            <ContextMenuItem icon={<FiEdit />} label={t("mcm.edit")} onClick={onEdit} />
            <ContextMenuItem icon={<TiArrowForwardOutline />} label={t("mcm.forward")} onClick={onForward} disabled={!isMine}/>
            <ContextMenuItem icon={<RiReplyLine />} label={t("mcm.reply")} onClick={onReply} />
            <ContextMenuItem icon={<FiTrash2 />} label={t("mcm.delete")} danger onClick={onDelete} disabled={!isMine}/>
        </ContextMenu>
    );
}