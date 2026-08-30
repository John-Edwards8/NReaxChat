import React from "react";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;

    onSave?: () => void;
    saveText?: string;
    saveClassName?: string;

    closeText?: string;
    closeClassName?: string;

    title?: string;
    titleClassName?: string;

    children?: React.ReactNode;
}