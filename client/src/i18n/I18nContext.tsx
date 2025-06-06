import React, { createContext, useContext, useState } from 'react';
import { translations, Language } from './translations';

interface I18nContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];
        for (const k of keys) {
            if (value[k] === undefined) return key;
            value = value[k];
        }
        return typeof value === 'string' ? value : key;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextProps => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
};
