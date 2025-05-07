import React from "react";
import {InputProps} from '../../types/Input';
import {usePlaceholder} from "../../hooks/usePlaceholder";

const getInputClasses = (variant: InputProps['variant'] = 'login') => {
    switch (variant) {
        case 'chat':
            return 'bg-transparent outline-none placeholder-white';
        case 'search':
            return 'w-full rounded-22 bg-[#1E75BC] placeholder-white px-4 py-2 pl-10 outline-none';
        case 'login':
        default:
            return 'w-full bg-blue-base rounded-22 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-active placeholder-white';
    }
}

const Input: React.FC<InputProps> =
    ({
         id, label, type = 'text', value, required = false, onChange, onKeyDown,
         className = '', wrapperClassName = '', placeholder, placeholderKey, variant, placeholderAnimated = false
     }) => {
        const [focused, setFocused] = React.useState(false);
        const shouldAnimate = placeholderAnimated === true || (placeholderAnimated === 'onFocus' && focused);
        const animated = usePlaceholder(placeholderKey ?? 'username', shouldAnimate);

        let placeholderToUse;
        if (placeholderKey) {
            placeholderToUse = animated;
        } else {
            placeholderToUse = placeholder;
        }

        let baseClasses = className;
        if (variant) {
            baseClasses = `${getInputClasses(variant)} ${className}`.trim();
        }

        return (
            <div className={`flex flex-col space-y-1 ${wrapperClassName}`}>
                {label && <label htmlFor={id} className="font-medium">{label}</label>}
                <input
                    id={id}
                    type={type}
                    value={value}
                    required={required}
                    placeholder={placeholderToUse}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className={`${baseClasses} ${className}`}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </div>
        );
    };

export default Input;