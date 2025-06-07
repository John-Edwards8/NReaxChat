import React, {useState} from 'react';
import Modal from '../ui/Modal';
import Input from "../ui/Input";
import {ModalProps} from "../../types/Modal";
import { useErrorStore } from '../../stores/errorStore';
import ErrorMessage from '../ui/ErrorMessage';
import { useI18n } from '../../i18n/I18nContext';

const SettingModal: React.FC<ModalProps> = (props) => {
    const [username, setUsername] = useState('');
    const { setError, clearAll } = useErrorStore();
    const { t } = useI18n();
    
    const handleSave = () => {
        console.log('New username: ', username);
        if (!username) setError(t("errors.missingUsername"), 'inline', 'all');
    }

    const handleClose = () => {
        setUsername('');
        clearAll();
        props.onClose();
    }

    return (
        <Modal {...props} title={t("modals.title.settings")} onSave={handleSave} onClose={handleClose}>
            <Input
                id="text"
                label={t("modals.label.text")}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="login"
                placeholder={t("placeholders.modals.settings.username")}
            />
            <ErrorMessage field="all" />
        </Modal>
    );
};

export default SettingModal;