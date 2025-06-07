import React from 'react';
import Modal from '../ui/Modal';
import { ModalProps } from '../../types/Modal';
import { IoArrowBackOutline } from "react-icons/io5";
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../i18n/I18nContext';

const ChangeThemeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const { t } = useI18n();

    const buttonBase = "flex items-center justify-between gap-2 px-4 py-2 rounded-22 text-base font-xl bg-white/10 hover:bg-white/20 transition-colors dark:bg-white/10 dark:hover:bg-white/20";

    const activeStyle = "bg-chat-active";

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeText="">
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-full flex items-center justify-center mb-2">
                    <button onClick={onClose} aria-label="Back" className="absolute left-0 hover:text-white/70">
                        <IoArrowBackOutline size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-center w-full">
                        {t("pleaseChoose")}
                    </h2>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    <button className={`${buttonBase} ${isDark ? activeStyle : ''}`}
                        onClick={() => {
                            if (!isDark) toggleTheme();
                        }}
                    >
                        {t("dark")}
                    </button>

                    <button className={`${buttonBase} ${!isDark ? activeStyle : ''}`}
                        onClick={() => {
                            if (isDark) toggleTheme();
                        }}
                    >
                        {t("light")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeThemeModal;
