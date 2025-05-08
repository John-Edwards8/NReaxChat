import React, { useEffect, useState } from 'react';
import { ErrorMessageProps } from '../../types/ErrorMessage';

const ErrorMessage: React.FC<ErrorMessageProps> = ({message, variant = 'inline', className = '', onClose}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
    }, [message]);

    if (!message || !visible) return null;

    let baseClasses = 'text-red-500 text-sm font-medium';

    if (variant === 'toast') {
        baseClasses = `fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-md ${className}`;
    }

    return (
        <div className={`${baseClasses} ${className}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="flex-1">{message}</span>
                <button
                    className="text-xl font-bold text-gray-800 hover:text-red-700 transition-colors"
                    onClick={onClose}
                >
                    Х
                </button>
            </div>
        </div>
    );
};

export default ErrorMessage;