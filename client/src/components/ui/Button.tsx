import { ButtonProps } from '../../types/Button';

const Button =
    ({type = 'button', value, onClick, className = '', disabled = false,}: ButtonProps) => {
    if (type === 'xbutton') {
        const finalClass = (
            'text-xl font-bold text-gray-800 hover:text-red-700 transition-colors' +
            (disabled ? ' opacity-50 cursor-not-allowed' : '') +
            ' ' +
            className
        ).trim();
    
        return (
          <button
            disabled={disabled}
            onClick={onClick}
            className={finalClass}
          >
            {value}
          </button>
        );
    }

        const finalClass = (
            'bg-blue-base hover-scale w-full py-2 rounded-22 font-semibold transition-all' +
            (disabled ? ' opacity-50 cursor-not-allowed' : '') +
            ' ' +
            className
        ).trim();

    return (
        <input
            type={type}
            value={value}
            disabled={disabled}
            onClick={onClick}
            className={finalClass}
        />
    );
};

export default Button;
