import React from 'react';
import ReactModal from 'react-modal';
import {ModalProps} from '../../types/Modal';
import Button from './Button';

const Modal: React.FC<ModalProps> = ({isOpen, onClose, title, children}) => {
    return (
        <ReactModal isOpen={isOpen} onRequestClose={onClose}
                    className="bg-[#0F172A]/90 p-4 rounded-22 max-w-xl w-full max-h-[90vh] overflow-y-auto mx-auto mt-24 shadow-chat outline-none"
                    overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
        >
            {title && <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>}
            {children}
            <div className="flex justify-center mt-4">
                <Button type="button" value="Close" onClick={onClose} className="max-w-[100px]"/>
            </div>
        </ReactModal>
    );
};

export default Modal;