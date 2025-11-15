import React from 'react';

interface FloatingIconButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    hasNotification?: boolean;
    className?: string;
    title?: string;
}

const FloatingIconButton: React.FC<FloatingIconButtonProps> = ({ onClick, icon, hasNotification, className, title }) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`fixed z-[1001] w-12 h-12 md:w-14 md:h-14 bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-100 ${className}`}
        >
            <div className="relative text-2xl md:text-3xl text-white">
                {icon}
                {hasNotification && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red border-2 border-black"></span>
                )}
            </div>
        </button>
    );
};

export default FloatingIconButton;