import { useTheme } from '../../hooks/useTheme';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const Icon = isDark ? FiMoon : FiSun;
    const textColor = isDark ? 'text-white' : 'text-black';

    return (
        <div onClick={toggleTheme} className={`flex items-center gap-2 cursor-pointer select-none transition-transform duration-300 hover:scale-110 ${textColor}`}>
            <span>{isDark ? 'Dark' : 'Light'}</span>
            <Icon className={`text-xl`} />
        </div>
    );
};

export default ThemeToggle;
