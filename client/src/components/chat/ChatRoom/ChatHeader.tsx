import { ChatRoom } from "../../../types/ChatRoom";
import { useAuthStore } from '../../../stores/authStore';
import { useI18n } from "../../../i18n/I18nContext";

const ChatHeader = ({ name, group, members }: ChatRoom) => {
    const { t } = useI18n();
    const currentUser = useAuthStore((state) => state.currentUser);

    const displayName =
        !group && currentUser
            ? members.find((u) => u !== currentUser) || name
            : name;

    return (
        <div className="flex items-center gap-3 p-2 bg-blue-base">
            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
                <div className="font-semibold">{displayName}</div>
                {group && <div className="text-sm">{members.length} {t("membersText")}</div>}
            </div>
        </div>
    );
};

export default ChatHeader;