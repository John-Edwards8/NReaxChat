import React from 'react';
import Modal from '../ui/Modal';
import { ModalProps } from '../../types/Modal';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '../ui/Button';

const languages = ['English', 'Ukrainian', 'Polish', 'German', 'Russian'];

const LanguageSelectModal: React.FC<ModalProps & {
    currentLanguage: string;
    onSelectLanguage: (lang: string) => void;
}> = ({ isOpen, onClose, currentLanguage, onSelectLanguage }) => {
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
                {languages.map((lang) => (
                    <button
                        key={lang}
                        onClick={() => onSelectLanguage(lang)}
                        className={`w-40 py-2 rounded-full text-white font-medium shadow-md transition 
                            ${lang === currentLanguage ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default LanguageSelectModal;
