import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from "../ui/Input";
import { ModalProps } from "../../types/Modal";
import { useErrorStore } from '../../stores/errorStore';
import ErrorMessage from '../ui/ErrorMessage';
import { errors } from '../../constants/errors';

const UpdateDataModal: React.FC<ModalProps> = (props) => {
    const [username, setUsername] = useState('');
    const { setError, clearAll } = useErrorStore();

    const handleSave = () => {
        console.log('New username: ', username);
        if (!username) setError(errors.missingUsername, 'inline', 'all');
    }

    const handleClose = () => {
        setUsername('');
        clearAll();
        props.onClose();
    }

    return (
        <Modal {...props} title="Update personal data" onSave={handleSave} onClose={handleClose}>
            <Input
                id="text"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="login"
                placeholder="Type your NEW username"
            />
            <ErrorMessage field="all" />
        </Modal>
    );
};

export default UpdateDataModal;