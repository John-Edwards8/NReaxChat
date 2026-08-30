import { ReactNode } from 'react';

export type ContextMenuItemProps = {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    danger?: boolean;
};