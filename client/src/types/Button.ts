import { ReactNode } from "react";

export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | 'xbutton' | 'context';
    value?: string | ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}