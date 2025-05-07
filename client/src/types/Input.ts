import React from "react";
import {placeholderWords} from "../constants/placeholdersWords.ts";

export interface InputProps {
    id: string;
    label?: string;
    type?: string;
    value?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    wrapperClassName?: string;
    placeholder?: string;
    placeholderKey?: keyof typeof placeholderWords;
    variant?: 'login' | 'chat' | 'search';
    placeholderAnimated?: boolean | 'onFocus';
}