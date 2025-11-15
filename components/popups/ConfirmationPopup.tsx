import React from 'react';

interface ConfirmationPopupProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ show, title, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[3100]">
            <div className="bg-[var(--bg-popup)] p-4 rounded-lg w-80 max-w-[90%] shadow-2xl text-[var(--text-main)] text-center animate-popup-scale">
                <h3 className="mt-0 text-[var(--text-header)] text-lg mb-2">{title}</h3>
                <p className="my-4">{message}</p>
                <div className="flex justify-around mt-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Annuler</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-700 hover:bg-red-600 transition-colors">Confirmer</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;