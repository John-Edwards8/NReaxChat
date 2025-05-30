import React from 'react';
import { Props } from '../../types/ErrorMessage';
import { useErrorStore } from '../../stores/errorStore';
import Button from './Button';

const ErrorMessage: React.FC<Props> = ({ field, className = 'text-center font-semibold' }) => {
    const global = useErrorStore((s) => s.global);
    const fields = useErrorStore((s) => s.fields);
    const clearError = useErrorStore((s) => s.clearError);

    const entry = field ? fields[field] : global;
    const message = entry?.message;
    const variant = entry?.variant;
  
    if (!message) return null;
  
    switch (variant) {
      case 'toast':
        className += 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded-md';
        break;
      case 'nonError':
        className += 'fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-md';
        break;
      case 'inline':
        className += ' text-red-500';
        break;
      case 'inlineSuccess':
        className += ' text-green-500';
        break;
      default:
        break;
    }

    return (
        <div className={`${className}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="flex-1">{message}</span>
                {!['inline', 'inlineSuccess'].includes(variant) && ( <Button 
                  value='X'
                  className="text-xl font-bold text-gray-800 hover:text-red-700 transition-colors"
                  onClick={() => clearError(field)}
                />)}
            </div>
        </div>
    );
};

export default ErrorMessage;