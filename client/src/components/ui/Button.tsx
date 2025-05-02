import { ButtonProps } from '../../types/Button';

const Button =
    ({type = 'button', value, onClick, className = '', disabled = false,}: ButtonProps) => {
    const baseClasses = 'bg-blue-base hover-scale w-full py-2 rounded-22 font-semibold transition-all';
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <input
            type={type}
            value={value}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${disabledClasses} ${className}`.trim()}
        />
    );
};

export default Button;
