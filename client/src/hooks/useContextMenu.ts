import React, { useEffect, useState } from 'react';
import { ContextMenuState } from '../types/ContextMenuState';

export function useContextMenu() {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

    const openContextMenu = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ messageId: id, x: e.clientX, y: e.clientY });
    };

    const closeContextMenu = () => setContextMenu(null);

    useEffect(() => {
        const handleClickOutside = () => closeContextMenu();
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeContextMenu();
        };

        if (contextMenu) {
            window.addEventListener("click", handleClickOutside);
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
            window.removeEventListener("keydown", handleEsc);
        };
    }, [contextMenu]);

    return { contextMenu, openContextMenu, closeContextMenu, };
}