import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { ModalProps } from '../../types/Modal';
import Button from '../ui/Button';
import { useChatRoomStore } from '../../stores/chatRoomStore';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { useErrorStore } from '../../stores/errorStore';
import ErrorMessage from '../ui/ErrorMessage';
import { useI18n } from '../../i18n/I18nContext';


const AddRoomModal: React.FC<ModalProps> = (props) => {
    const { fetchRooms, addRoom, rooms } = useChatRoomStore();
    const { users, fetchUsers } = useUserStore();
    const [roomName, setRoomName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { setError, clearError } = useErrorStore();
    const errorMessage = useErrorStore(s => s.fields.all?.message);
    const { t } = useI18n();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUser = (username: string) => {
        setSelectedMembers(prev =>
            prev.includes(username)
                ? prev.filter(u => u !== username)
                : [...prev, username]
        );
    };

    const handleSave = async () => {
        const { currentUser } = useAuthStore.getState();
        if (!currentUser) return;

        const members = selectedMembers.includes(currentUser)
            ? selectedMembers
            : [...selectedMembers, currentUser];

        if (members.length === 1) {
            setError(t("errors.oneAtLeast"), 'inline', 'all');
            return;
        }
        
        const isGroup = members.length > 2;

        if (isGroup && !roomName.trim()) {
            setError(t("errors.missingGroupChatName"), 'inline', 'all');
            return;
        }

        const name = members.length === 2
            ? members.find(m => m !== currentUser) || currentUser
            : roomName;
        
        if (!isGroup) {
            const otherUser = members.find(m => m !== currentUser)!;

            const duplicate = rooms.find(room =>
                !room.group &&
                room.members.length === 2 &&
                room.members.includes(currentUser) &&
                room.members.includes(otherUser)
            );

            if (duplicate) {
                setError(t("errors.alreadyExists"), 'inline', 'all');
                return;
            }
        }

        try {
            await addRoom({ name, group: isGroup, members });
            await fetchRooms();
            setError(t("errors.successfullyAdded"), 'nonError');
            handleClose();
        } catch {
            setError(t("errors.catchFailed"), 'inline', 'all');
        }
    };

    const handleClose = () => {
        setRoomName('');
        setSearchQuery('');
        setSelectedMembers([]);
        clearError('all');
        props.onClose();
    };

    return (
        <Modal {...props} title={t("modals.title.addroom")} onSave={handleSave} onClose={handleClose}>
            <div className="space-y-4">
                {selectedMembers.length >= 2 && <Input
                    id="roomName"
                    label={t("modals.label.roomName")}
                    value={roomName}
                    required
                    onChange={(e) => setRoomName(e.target.value)}
                    variant="login"
                    placeholder={t("placeholders.modals.addroom.roomName")}
                    wrapperClassName="flex-row items-center gap-2 space-y-0"
                    className="flex-1"
                />}

                <Input
                    id="search"
                    label={t("modals.label.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="login"
                    placeholder={t("placeholders.modals.addroom.search")}
                    wrapperClassName="flex-row items-center gap-2 space-y-0"
                    className="flex-1"
                />

                <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto overflow-x-hidden border rounded-22 p-2">
                    {filteredUsers.map(user => (
                        <div key={user} className="inline-block">
                        <Button
                            type="button"
                            value={user}
                            onClick={() => toggleUser(user)}
                            className={`px-3 py-1 text-sm whitespace-nowrap ${selectedMembers.includes(user) ? 'bg-chat-active' : 'bg-chat-inactive'}`}
                        />
                        </div>
                    ))}
                </div>
            </div>

            {selectedMembers && !errorMessage && (
                <p className="text-sm text-center">
                    {selectedMembers.length >= 2
                        ? t("placeholders.modals.addroom.group")
                        : selectedMembers.length === 1
                            ? t("placeholders.modals.addroom.chat")
                            : t("placeholders.modals.addroom.warn")}
                </p>
            )}
            <ErrorMessage field="all" />
        </Modal>
    );
};

export default AddRoomModal;