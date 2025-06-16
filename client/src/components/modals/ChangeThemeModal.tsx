import React from 'react';
import Modal from '../ui/Modal';
import { ModalProps } from '../../types/Modal';
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../i18n/I18nContext';
import { FiArrowLeft } from "react-icons/fi";
import Button from "../ui/Button";

const ChangeThemeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useI18n();

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeText="">
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-full flex items-center justify-center">
                    <Button
                        type="submit"
                        onClick={onClose}
                        className="rounded-full transition btn-modal-hover"
                        value={<FiArrowLeft className="text-xl"/>}
                    />
                    <h2 className="text-lg font-semibold text-center w-full">
                        {t("pleaseChoose")}
                    </h2>
                </div>

                <div className="flex flex-col gap-4 items-center">
                    <Button
                        type="context"
                        value={t("dark")}
                        onClick={() => { if (theme !== "dark") toggleTheme(); }}
                        className={`max-w rounded-full font-medium shadow-md transition 
                            ${theme === "dark" ? 'btn-modal' : 'btn-modal-hover'}`}
                    />
                    <Button
                        type="context"
                        value={t("light")}
                        onClick={() => { if (theme !== "light") toggleTheme(); }}
                        className={`max-w rounded-full font-medium shadow-md transition 
                            ${theme === "light" ? 'btn-modal' : 'btn-modal-hover'}`}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ChangeThemeModal;
