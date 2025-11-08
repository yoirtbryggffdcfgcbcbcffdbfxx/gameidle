
import React from 'react';

interface PopupProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-[var(--bg-popup)] p-4 rounded-lg w-80 max-w-[90%] shadow-2xl max-h-[80vh] overflow-y-auto text-[var(--text-main)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                     <h3 className="mt-0 text-[var(--text-header)] text-lg">{title}</h3>
                     <button onClick={onClose} className="text-2xl text-[var(--text-main)] hover:text-red-500 transition-colors">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Popup;
