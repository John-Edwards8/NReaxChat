import { ContextMenuItemProps } from '../../../types/ContexMenuItem';
import Button from "../Button";

export default function ContextMenuItem({ icon, label, onClick, className = '', disabled = false, danger = false }: ContextMenuItemProps) {
    const dangerClass = danger ? 'bg-[#FB2C36] rounded-b-22' : '';

    return (
        <Button
            type="context"
            onClick={onClick}
            disabled={disabled}
            className={`w-full px-4 py-2 ${dangerClass} ${className}`}
            value={
                <>
                    {icon && <span className="w-[14px] h-[14px]">{icon}</span>}
                    <span>{label}</span>
                </>
            }
        />
    );
}