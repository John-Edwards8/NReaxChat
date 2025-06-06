import React, {useState} from "react";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../../modals/LogoutModal.tsx";

const Exit: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div
                className="flex items-center gap-3 px-4 cursor-pointer"
                onClick={openModal}
            >
                <FiLogOut className="w-16 h-16 text-blue-base "/>
                <span className="text-2xl font-semibold">Exit</span>
            </div>
            <LogoutModal isOpen={isModalOpen} onClose={closeModal}/></>
    );
};

export default Exit;
