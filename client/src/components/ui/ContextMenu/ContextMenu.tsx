import { ContextMenuProps } from '../../../types/ContextMenu';

export default function ContextMenu({ children, className = '' }: ContextMenuProps) {
    return (
        <div className={`flex flex-col items-start bg-blue-base rounded-22 shadow-[0_4px_12px_rgba(0,0,0,0.6)] min-w-[140px] max-w-[220px] max-h-[350px] overflow-auto gap-1 ${className}`}>
            {children}
        </div>
    );
}