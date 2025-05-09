import React, {useState} from 'react';
import Modal from '../ui/Modal';
import Input from "../ui/Input";
import {ModalProps} from "../../types/Modal";

const SettingModal: React.FC<ModalProps> = (props) => {
    const [username, setUsername] = useState('');

    const handleSave = () => {
        console.log('New username: ', username);
        props.onClose();
    }

    return (
        <Modal {...props} title="Settings" onSave={handleSave}>
            <div>
                <Input
                    id="text"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="login"
                    placeholder="Type your NEW username"
                />
            </div>
        </Modal>
    );
};

export default SettingModal;