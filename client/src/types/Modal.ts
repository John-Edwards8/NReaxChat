import React from "react";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: () => void;
    title? : string;
    children?: React.ReactNode;
}