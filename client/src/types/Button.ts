export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    value?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}