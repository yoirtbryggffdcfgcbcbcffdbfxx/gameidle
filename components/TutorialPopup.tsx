import React from 'react';

interface TutorialPopupProps {
    show: boolean;
    onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[var(--bg-popup)] text-[var(--text-main)] p-3 rounded-lg w-64 text-center shadow-2xl z-40">
            <p>⚡ Clique = énergie</p>
            <p className="my-1">↑ Upgrades = production</p>
            <p>✨ Prestige = bonus permanent</p>
            <button onClick={onClose} className="bg-blue-600 text-white mt-2 px-4 py-1 rounded">J'ai compris</button>
        </div>
    );
};

export default TutorialPopup;
