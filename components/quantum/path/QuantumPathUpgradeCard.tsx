import React from 'react';
import { PathUpgrade } from '../../../types';

interface QuantumPathUpgradeCardProps {
    upgrade: PathUpgrade;
    currentLevel: number;
    quantumShards: number;
    onPurchase: () => void;
}

const QuantumPathUpgradeCard: React.FC<QuantumPathUpgradeCardProps> = ({ upgrade, currentLevel, quantumShards, onPurchase }) => {
    
    const isUnlocked = currentLevel >= upgrade.level;
    const isBuyable = currentLevel === upgrade.level - 1;
    const canAfford = quantumShards >= upgrade.cost;

    let statusStyles = {
        bg: 'bg-gray-800/50',
        border: 'border-gray-600',
        opacity: 'opacity-60',
        icon: '🔒'
    };

    if (isUnlocked) {
        statusStyles = {
            bg: 'bg-green-800/30',
            border: 'border-green-500/50',
            opacity: 'opacity-50',
            icon: '✓'
        };
    } else if (isBuyable) {
        statusStyles = {
            bg: 'bg-black/40',
            border: 'border-cyan-500',
            opacity: '',
            icon: `${upgrade.level}`
        };
    }

    return (
        <div className={`p-3 md:p-4 flex items-center gap-4 md:gap-6 rounded-lg border-l-4 transition-all duration-300 ${statusStyles.bg} ${statusStyles.border} ${statusStyles.opacity}`}>
            <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg md:text-xl ${isUnlocked ? 'bg-green-600' : isBuyable ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                {statusStyles.icon}
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-sm md:text-base">{upgrade.description}</p>
            </div>
            {isBuyable && (
                <button
                    onClick={onPurchase}
                    disabled={!canAfford}
                    className={`flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded transition-colors
                        ${canAfford ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-red-900 cursor-not-allowed'}
                    `}
                >
                    Acheter ({upgrade.cost} FQ)
                </button>
            )}
        </div>
    );
};

export default QuantumPathUpgradeCard;