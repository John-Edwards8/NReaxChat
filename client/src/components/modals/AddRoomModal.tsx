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


const AddRoomModal: React.FC<ModalProps> = (props) => {
    const { fetchRooms, addRoom, rooms } = useChatRoomStore();
    const { users, fetchUsers } = useUserStore();
    const [roomName, setRoomName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { setError, clearError } = useErrorStore();
    const errorMessage = useErrorStore(s => s.fields.all?.message);

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
            setError('Please select at least one user', 'inline', 'all');
            return;
        }
        
        const isGroup = members.length > 2;

        if (isGroup && !roomName.trim()) {
            setError('Please enter a name for the group chat', 'inline', 'all');
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
                setError('Private chat with this user already exists', 'inline', 'all');
                return;
            }
        }

        try {
            await addRoom({ name, group: isGroup, members });
            await fetchRooms();
            setError('Chat successfully added!', 'nonError');
            handleClose();
        } catch {
            setError('Failed to create the chat room. Please try again', 'inline', 'all');
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
        <Modal {...props} title="Create Chat Room" onSave={handleSave} onClose={handleClose}>
            <div className="space-y-4">
                {selectedMembers.length >= 2 && <Input
                    id="roomName"
                    label="Room Name"
                    value={roomName}
                    required
                    onChange={(e) => setRoomName(e.target.value)}
                    variant="login"
                    placeholder="Enter room name..."
                    wrapperClassName="flex-row items-center gap-2 space-y-0"
                    className="flex-1"
                />}

                <Input
                    id="search"
                    label="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="login"
                    placeholder="Search for users..."
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
                        ? 'A group chat will be created.'
                        : selectedMembers.length === 1
                            ? 'A private chat will be created.'
                            : 'Select at least 1 user to create a chat.'}
                </p>
            )}
            <ErrorMessage field="all" />
        </Modal>
    );
};

export default AddRoomModal;