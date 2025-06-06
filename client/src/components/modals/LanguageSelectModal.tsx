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
            <div className="flex items-center gap-2 mb-6">
                <Button
                    type="submit"
                    onClick={onClose}
                    className="rounded-full text-white transition"
                    value={<FiArrowLeft className="text-white text-xl" />}
                />
                <h2 className="text-white text-lg font-semibold">Please choose language</h2>
            </div>

            <div className="flex flex-col items-center gap-4">
                {languages.map(({ code, label }) => (
                    <button
                        key={code}
                        onClick={() => setLanguage(code)}
                        className={`w-40 py-2 rounded-full text-white font-medium shadow-md transition 
                            ${code === language ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default LanguageSelectModal;
