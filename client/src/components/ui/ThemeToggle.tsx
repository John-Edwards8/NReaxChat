import { useTheme } from '../../hooks/useTheme';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useI18n } from '../../i18n/I18nContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const Icon = isDark ? FiMoon : FiSun;
    const textColor = isDark ? 'text-white' : 'text-black';
    const { t } = useI18n();

    return (
        <div onClick={toggleTheme} className={`flex items-center gap-2 cursor-pointer select-none transition-transform duration-300 hover:scale-110 ${textColor}`}>
            <span>{isDark ? t("dark") : t("light")}</span>
            <Icon className={`text-2xl`} />
        </div>
    );
};

export default ThemeToggle;
