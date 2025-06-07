import React from 'react';
import ReactModal from 'react-modal';
import {ModalProps} from '../../types/Modal';
import Button from './Button';

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         onSave,

                                         saveText = "Save",
                                         saveClassName = "",

                                         closeText = "Close",
                                         closeClassName = "",

                                         title,
                                         titleClassName = '',
                                         children,
                                     }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-container-modal p-4 rounded-22 max-w-md w-full max-h-[90vh] overflow-y-auto mx-auto mt-24 shadow-chat outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
            ariaHideApp={false}
        >
            {title && (
                <h2
                    className={`text-lg font-semibold mb-4 text-center ${titleClassName}`.trim()}
                >
                    {title}
                </h2>
            )}

            {children}

            <div className="flex justify-center mt-4 space-x-4">
                {onSave && (
                    <Button
                        type="button"
                        value={saveText}
                        onClick={onSave}
                        className={`max-w-[100px] ${saveClassName}`.trim()}
                    />
                )}

                {closeText !== null && closeText !== "" && (
                    <Button
                        type="button"
                        value={closeText}
                        onClick={onClose}
                        className={`max-w-[100px] ${closeClassName}`.trim()}
                    />
                )}
            </div>
        </ReactModal>
    );
};

export default Modal;