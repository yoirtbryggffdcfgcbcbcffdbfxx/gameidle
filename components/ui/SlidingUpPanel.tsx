import React, { useState, useEffect } from 'react';

interface SlidingUpPanelProps {
    show: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
}

const SlidingUpPanel: React.FC<SlidingUpPanelProps> = ({ show, onClose, title, children }) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (show) {
            setIsRendered(true);
        } else {
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setIsRendered(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isRendered) {
        return null;
    }

    const animationClass = show ? 'animate-slide-in-up' : 'animate-slide-out-down';

    return (
        <div className="md:hidden fixed inset-0 z-[2000]">
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className={`fixed bottom-0 left-0 right-0 bg-[var(--bg-popup)] rounded-t-2xl shadow-2xl flex flex-col h-[85vh] ${animationClass}`}>
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                    <div className="w-8 h-1.5 bg-gray-600 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2"></div>
                    <h2 className="text-lg text-[var(--text-header)] font-bold text-center flex-grow flex items-center justify-center gap-2">{title}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                {/* Content */}
                <div className="flex-grow overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SlidingUpPanel;