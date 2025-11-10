// FIX: This file was created to resolve module not found errors.
import React from 'react';

interface PopupProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    widthClass?: string;
}

const Popup: React.FC<PopupProps> = ({ title, onClose, children, widthClass }) => {
    return (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[100] animate-fade-in-fast">
            <div className={`bg-[var(--bg-popup)] p-4 rounded-lg ${widthClass || 'w-96'} max-w-[95%] shadow-2xl text-[var(--text-main)] animate-popup-scale`}>
                <div className="flex justify-between items-center mb-4 border-b border-[var(--border-color)] pb-2">
                    <h2 className="text-xl text-[var(--text-header)] m-0">{title}</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Popup;
