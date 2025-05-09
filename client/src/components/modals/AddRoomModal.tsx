import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { logger } from '../../utils/logger';
import { ModalProps } from '../../types/Modal';
import Button from '../ui/Button';

const AddRoomModal: React.FC<ModalProps> = (props) => {
    const [roomName, setRoomName] = useState('');
    const [users] = useState<string[]>(['alice_smith', 'bob_jones', 'carol_davis', 'dave_wilson', 'eva_martin', 'frank_white', 'grace_lee', 'hank_kim', 'iris_owens', 'jack_clark']);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredUsers = users.filter(user => user.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleUser = (username: string) => {
        setSelectedMembers(prev =>
            prev.includes(username)
                ? prev.filter(u => u !== username)
                : [...prev, username]
        );
    };

    const handleSave = () => {
        const isGroup = selectedMembers.length > 2;
        logger.info('Create room:', { name: roomName, isGroup, members: selectedMembers });
        props.onClose();
    };

    return (
        <Modal {...props} title="Create Chat Room" onSave={handleSave}>
            <div className="space-y-4">
                <Input
                    id="roomName"
                    label="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    variant="login"
                    placeholder="Enter room name..."
                    wrapperClassName="flex-row items-center gap-2 space-y-0"
                    className="flex-1"
                />

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

            {selectedMembers.length > 0 && (
                <p className="text-sm text-center">
                    {selectedMembers.length > 2
                        ? 'A group chat will be created.'
                        : selectedMembers.length === 2
                            ? 'A private chat will be created.'
                            : 'Select at least 2 users to create a chat.'}
                </p>
            )}
        </Modal>
    );
};

export default AddRoomModal;