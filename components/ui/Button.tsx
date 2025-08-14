import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type: string;
    disabled?: boolean;
}

export default function Button({ children, onClick, type, disabled = false }: ButtonProps) {
    return (
        <button disabled={disabled} onClick={onClick} className={`w-full max-w-sm ${type === 'primary' ? 'bg-primary text-white hover:bg-primary/80' : 'bg-white text-primary hover:bg-gray-50'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} font-semibold py-4 px-8 rounded-2xl text-lg transition-colors duration-200 shadow-lg`}>
            {children}
        </button>
    )
}