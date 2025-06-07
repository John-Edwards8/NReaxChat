import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { ModalProps } from '../../types/Modal';
import { IoArrowForwardOutline } from "react-icons/io5";
import UpdateDataModal from '../modals/UpdateDataModal';
import ChangeThemeModal from '../modals/ChangeThemeModal';

const SettingModal: React.FC<ModalProps> = (props) => {
    const [modalType, setModalType] = useState<null | 'update' | 'theme' >(null);

    const handleBack = () => setModalType(null);

    if (modalType === 'update') return <UpdateDataModal isOpen={true} onClose={handleBack} />;
    if (modalType === 'theme') return <ChangeThemeModal isOpen={true} onClose={handleBack} />;

    const buttonBase =
        "w-full flex items-center justify-between gap-2 px-4 py-2 rounded-22 text-base font-medium " +
        "hover:bg-white/20 transition-colors dark:hover:bg-white/20";

    return (
        <Modal {...props} title="Settings" onClose={props.onClose} closeText="">
            <div className="flex flex-col items-center gap-3">
                <button className={buttonBase} onClick={() => setModalType('update')}>
                    <span>Update personal data</span>
                    <IoArrowForwardOutline />
                </button>

                <button className={buttonBase} onClick={() => setModalType('theme')}>
                    <span>Change theme</span>
                    <IoArrowForwardOutline />
                </button>
            </div>
        </Modal>
    );
};

export default SettingModal;