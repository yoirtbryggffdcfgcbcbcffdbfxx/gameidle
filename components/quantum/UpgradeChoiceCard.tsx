import React from 'react';
import { QuantumPath, QuantumPathType } from '../../types';

interface UpgradeChoiceCardProps {
    type: QuantumPathType;
    pathData: QuantumPath;
    onChoose: () => void;
}

const ICONS: Record<QuantumPathType, string> = {
    RATE: '⏩',
    MULTIPLIER: '💥',
    BALANCED: '💫'
};

const UpgradeChoiceCard: React.FC<UpgradeChoiceCardProps> = ({ type, pathData, onChoose }) => {
    
    const handleInteraction = (e: React.PointerEvent) => {
        e.preventDefault();
        onChoose();
    };

    return (
        <div className="bg-black/40 border-2 border-cyan-500 hover:border-cyan-300 rounded-lg p-3 sm:p-4 flex flex-col text-center transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="text-3xl sm:text-4xl mb-2">{ICONS[type]}</div>
            <h3 className="font-bold text-yellow-400 text-base mb-2">{pathData.name}</h3>
            <p className="text-xs sm:text-sm flex-grow mb-4">{pathData.description}</p>
            <button
                onPointerDown={handleInteraction}
                className="w-full px-4 py-2 rounded-md font-bold text-xs transition-all bg-cyan-700 group-hover:bg-cyan-600 active:scale-95 active:brightness-90"
            >
                Choisir cette Voie
            </button>
        </div>
    );
};

export default UpgradeChoiceCard;