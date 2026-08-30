import React from 'react';
import Modal from '../ui/Modal';
import { ModalProps } from '../../types/Modal';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '../ui/Button';
import { useI18n } from '../../i18n/I18nContext';
import { Language } from '../../i18n/translations';

const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ua', label: 'Українська' },
    { code: 'pl', label: 'Polski' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' },
];

const LanguageSelectModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { language, setLanguage, t } = useI18n();
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            closeText=""
        >
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative w-full flex items-center justify-center">
                    <Button
                        type="submit"
                        onClick={onClose}
                        className="rounded-full transition btn-modal-hover"
                        value={<FiArrowLeft className="text-xl" />}
                    />
                    <h2 className="text-lg font-semibold text-center w-full">{t("modals.title.language")}</h2>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {languages.map(({ code, label }) => (
                        <Button
                            type='context'
                            value={label}
                            key={code}
                            onClick={() => setLanguage(code)}
                            className={`max-w rounded-full font-medium shadow-md transition 
                            ${code === language ? 'btn-modal' : 'btn-modal-hover'}`}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default LanguageSelectModal;
