import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { translations } from '../i18n/translations';

export const usePlaceholder = (key: keyof typeof translations.en.placeholders, enabled: boolean = true) => {
    const { language } = useI18n();
    const words = translations[language as keyof typeof translations]?.placeholders?.[key] ?? [];
    const [placeholder, setPlaceholder] = useState<string>(words[0] || '');
    const [currentWord, setCurrentWord] = useState(0);
    const [currentLetter, setCurrentLetter] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(() => {
            const word = words[currentWord];

            if (currentLetter < word.length) {
                setPlaceholder(word.slice(0, currentLetter + 1));
                setCurrentLetter((prev) => prev + 1);
            } else {
                setTimeout(() => {
                    const nextWordIndex = (currentWord + 1) % words.length;
                    setCurrentWord(nextWordIndex);
                    setCurrentLetter(1);
                    setPlaceholder(words[nextWordIndex].slice(0, 1));
                }, 5000);
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, [currentLetter, currentWord, words, enabled]);

    useEffect(() => {
        setCurrentWord(0);
        setCurrentLetter(0);
        setPlaceholder(words[0] || '');
    }, [language]);

    return placeholder;
};