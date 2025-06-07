import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const current = saved || system;

        document.documentElement.classList.toggle("dark", current === "dark");
        setTheme(current as "light" | "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return { theme, toggleTheme };
}
