export interface ButtonProps {
    type?: 'button' | 'submit' | 'reset' | 'xbutton';
    value?: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}