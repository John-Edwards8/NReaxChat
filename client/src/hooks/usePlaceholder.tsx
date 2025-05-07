import { useEffect, useState } from 'react';
import { placeholderWords } from '../constants/placeholdersWords.ts'

export const usePlaceholder = (key: keyof typeof placeholderWords, enabled: boolean = true) => {
    const words = placeholderWords[key];
    const [placeholder, setPlaceholder] = useState(words[0]);
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

    return placeholder;
};