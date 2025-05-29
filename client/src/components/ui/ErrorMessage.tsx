import React from 'react';
import { Props } from '../../types/ErrorMessage';
import { useErrorStore } from '../../stores/errorStore';

const ErrorMessage: React.FC<Props> = ({ field, className = 'text-center font-semibold' }) => {
    const global = useErrorStore((s) => s.global);
    const fields = useErrorStore((s) => s.fields);
    const clearError = useErrorStore((s) => s.clearError);

    const entry = field ? fields[field] : global;
    const message = entry?.message;
    const variant = entry?.variant;
  
    if (!message) return null;
  
    let baseClasses = 'text-sm font-medium';
    if (variant === 'toast') {
      baseClasses = `fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-md ${className}`;
    } else if (variant === 'nonError') {
      baseClasses = `fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-md ${className}`;
    } else if (variant === 'inline') {
      baseClasses += ' text-red-500';
    } else if (variant === 'inlineSuccess') {
      baseClasses += ' text-green-500';
    }

    return (
        <div className={`${baseClasses} ${className}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="flex-1">{message}</span>
                <button
                    className="text-xl font-bold text-gray-800 hover:text-red-700 transition-colors"
                    onClick={() => clearError(field)}
                >
                    Х
                </button>
            </div>
        </div>
    );
};

export default ErrorMessage;