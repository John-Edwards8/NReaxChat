import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import api from "../../api/axios";
import ReactModal from "react-modal";

interface ConfirmLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleConfirmLogout = async () => {
        try {
            await api.post("/auth/api/logout");
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            useAuthStore.getState().clearAuth();
            navigate("/login");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-[#0F172A]/90 p-4 rounded-22 w-full max-w-md overflow-y-auto mx-auto mt-24 shadow-chat outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
            ariaHideApp={false}
        >
            <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
                Logout Account
            </h2>

            <p className="text-center text-white mb-6">
                Are you sure you want to logout?
                <br />
                Once you logout you need to login again. Are you sure?
            </p>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleConfirmLogout}
                    className="px-5 py-2 bg-red-500 text-white rounded-full hover-scale transition-all"
                >
                    Logout
                </button>
                <button
                    onClick={onClose}
                    className="px-5 py-2 bg-blue-base text-white rounded-full hover-scale transition-all"
                >
                    Cancel
                </button>
            </div>
        </ReactModal>
    );
};

export default ConfirmLogoutModal;
