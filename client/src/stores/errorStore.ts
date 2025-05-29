import { create } from "zustand";
import { VariantType } from '../types/ErrorMessage';

interface ErrorState {
    global: { message: string; variant: VariantType };
    fields: Record<string, string>;

    setError: (message: string, variant?: VariantType, field?: string) => void;
    clearError: (field?: string) => void;
    clearAll: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
    global: { message: '', variant: 'toast' },
    fields: {},

    setError: (message, variant = 'toast', field) => {
        if (variant === 'inline' && field) {
            set((s) => ({ fields: { ...s.fields, [field]: message } }));
        } else {
            set({ global: { message, variant } });
        }
    },

    clearError: (field) => {
        if (field) {
            set((state) => {
            const { [field]: _, ...rest } = state.fields;
            return { fields: rest };
            });
        } else {
            set({ global: { message: '', variant: 'toast' } });
        }
    },

    clearAll: () => set({ global: { message: '', variant: 'toast' }, fields: {} }),
}));