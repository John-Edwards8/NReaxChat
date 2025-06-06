import React from "react";
import Modal from "../ui/Modal.tsx";
import {logout} from "../../api/auth.ts";
import {useNavigate} from "react-router-dom";

interface ConfirmLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleConfirmLogout = async () => {
        try {
            await logout(navigate);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleConfirmLogout}
            saveText="Logout"
            saveClassName="!bg-red-500 hover-scale"
            closeText="Cancel"
            closeClassName="bg-blue-base hover-scale"
            title="Logout Account"
            titleClassName="text-red-500"
        >
            <p className="text-center mb-6">
                Are you sure you want to logout?
                <br />
                Once you logout you need to login again.
            </p>
        </Modal>
    );
};

export default LogoutModal;
