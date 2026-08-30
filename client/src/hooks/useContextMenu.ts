import React, { useEffect, useState, useRef } from 'react';
import { ContextMenuState } from '../types/ContextMenuState';

export function useContextMenu() {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (!contextMenu || !menuRef.current) return;

        const menuEl = menuRef.current;
        const rect = menuEl.getBoundingClientRect();

        const padding = 10;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let newX = contextMenu.x;
        let newY = contextMenu.y;

        if (contextMenu.x + rect.width + padding > winWidth) {
            newX = contextMenu.x - rect.width;
        }

        if (contextMenu.y + rect.height + padding > winHeight) {
            newY = contextMenu.y - rect.height;
        }

        if (newX !== contextMenu.x || newY !== contextMenu.y) {
            setContextMenu({ ...contextMenu, x: newX, y: newY });
        }
    }, [contextMenu]);

    return { contextMenu, openContextMenu, closeContextMenu, menuRef };
}