import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type: string;
}

export default function Button({ children, onClick, type }: ButtonProps) {
    return (
        <button onClick={onClick} className={`w-full max-w-sm ${type === 'primary' ? 'bg-primary text-white' : 'bg-white text-primary'} cursor-pointer font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg`}>
            {children}
        </button>
    )
}