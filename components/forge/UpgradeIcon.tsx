
import React from 'react';

interface UpgradeIconProps {
    type: 'PRODUCTION' | 'CLICK' | 'BOOSTER';
    color: string;
    tierRank: string;
}

const UpgradeIcon: React.FC<UpgradeIconProps> = ({ type, color, tierRank }) => {
    const isClickUpgrade = type === 'CLICK';
    const isBoosterUpgrade = type === 'BOOSTER';

    return (
        <div className="flex sm:flex-col items-center justify-center p-3 min-w-[80px] bg-black/20 border-b sm:border-b-0 sm:border-r border-white/5">
            <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mb-0 sm:mb-2 mr-3 sm:mr-0 text-xl shadow-inner"
                style={{ backgroundColor: `${color}20`, color: color, boxShadow: `0 0 10px ${color}10` }}
            >
                {isClickUpgrade ? '👆' : isBoosterUpgrade ? '🚀' : '⚡'}
            </div>
            <div className="text-center">
                <span className="block text-[9px] text-gray-500 font-mono uppercase tracking-wider">Modèle</span>
                <span className="block text-xs font-bold font-mono text-white">{tierRank}</span>
            </div>
        </div>
    );
};

export default UpgradeIcon;
