export type VariantType = 'inline' | 'modal' | 'toast' | 'nonError';

export interface ErrorMessageProps {
    message?: string | null;
    className?: string;
    variant?: VariantType;
    onClose?: () => void;
}