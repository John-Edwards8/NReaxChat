import { create } from "zustand";
import { VariantType } from '../types/ErrorMessage';

interface ErrorState {
    message: string;
    variant: VariantType;
    setError: (msg: string, variant?: VariantType) => void;
    clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
    message: '',
    variant: 'toast',
    setError: (msg, variant = 'toast') => set({ message: msg, variant }),
    clearError: () => set({ message: '', variant: 'toast' }),
}));