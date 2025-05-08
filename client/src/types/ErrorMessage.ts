export interface ErrorMessageProps {
    message?: string | null;
    className?: string;
    variant?: 'inline' | 'modal' | 'toast';
    onClose?: () => void;
}