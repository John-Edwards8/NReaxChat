import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { ModalProps } from '../../types/Modal';
import Button from '../ui/Button';
import { useChatRoomStore } from '../../stores/chatRoomStore';
import { useUserStore } from '../../stores/userStore';


const AddRoomModal: React.FC<ModalProps> = (props) => {
    const { fetchRooms, addRoom } = useChatRoomStore();
    const { users, fetchUsers } = useUserStore();
    const [roomName, setRoomName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

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
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) return;

        const members = selectedMembers.includes(currentUser)
            ? selectedMembers
            : [...selectedMembers, currentUser];

        if (members.length === 1) return;
        
        const isGroup = members.length > 2;

        if (isGroup && !roomName) return;

        const name = members.length === 2
            ? members.find(m => m !== currentUser) || currentUser
            : roomName;
        
        await addRoom({ name, group: isGroup, members });
        await fetchRooms();
        
        handleClose();
    };

    const handleClose = () => {
        setRoomName('');
        setSearchQuery('');
        setSelectedMembers([]);
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
                        <div className="inline-block">
                        <Button
                            key={user}
                            type="button"
                            value={user}
                            onClick={() => toggleUser(user)}
                            className={`px-3 py-1 text-sm whitespace-nowrap ${selectedMembers.includes(user) ? 'bg-chat-active' : 'bg-blue-base'}`}
                        />
                        </div>
                    ))}
                </div>
            </div>

            {selectedMembers && (
                <p className="text-sm text-center">
                    {selectedMembers.length >= 2
                        ? 'A group chat will be created.'
                        : selectedMembers.length === 1
                            ? 'A private chat will be created.'
                            : 'Select at least 1 user to create a chat.'}
                </p>
            )}
        </Modal>
    );
};

export default AddRoomModal;