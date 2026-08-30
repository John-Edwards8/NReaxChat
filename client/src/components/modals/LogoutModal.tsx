import React from "react";
import Modal from "../ui/Modal.tsx";
import {logout} from "../../api/auth.ts";
import {useNavigate} from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext.tsx";

interface ConfirmLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { t } = useI18n();

    const handleConfirmLogout = async () => {
        try {
            await logout(navigate);
        } catch (err) {
            console.error(t("errors.logoutFailed"), err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleConfirmLogout}
            saveText={t("modals.label.saveTextOut")}
            saveClassName="!bg-red-500 hover-scale"
            closeText={t("modals.label.closeTextOut")}
            closeClassName="bg-blue-base hover-scale"
            title={t("modals.title.logout")}
            titleClassName="text-red-500"
        >
            <p className="text-center mb-6">
                {t("placeholders.modals.logout.sure")}
                <br />
                {t("placeholders.modals.logout.again")}
            </p>
        </Modal>
    );
};

export default LogoutModal;
