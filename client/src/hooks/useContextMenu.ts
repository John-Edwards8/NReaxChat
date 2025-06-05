import React, { useEffect, useState } from 'react';

export function useContextMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(true);
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = () => closeMenu();
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [menuOpen]);

    return { menuOpen, position, handleContextMenu, closeMenu };
}