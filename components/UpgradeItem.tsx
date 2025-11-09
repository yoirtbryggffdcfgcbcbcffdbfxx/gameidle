import React from 'react';
import { Upgrade } from '../types';
import { MAX_UPGRADE_LEVEL } from '../constants';

interface UpgradeItemProps {
    id: string;
    upgrade: Upgrade;
    onBuy: () => void;
    formatNumber: (num: number) => string;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({ id, upgrade, onBuy, formatNumber }) => {
    const isClickUpgrade = upgrade.type === 'CLICK';
    const isBoosterUpgrade = upgrade.type === 'BOOSTER';

    const effectText = isClickUpgrade
        ? `+${formatNumber(upgrade.production)} par clic`
        : isBoosterUpgrade
            ? `+${upgrade.production}% Prod. Totale`
            : `${formatNumber(upgrade.production)}/sec`;

    const totalEffectText = isClickUpgrade
        ? `Bonus Clic Total: +${formatNumber(upgrade.production * upgrade.owned)}`
        : isBoosterUpgrade
            ? `Bonus Prod. Total: +${upgrade.production * upgrade.owned}%`
            : `Prod. Totale: ${formatNumber(upgrade.production * upgrade.owned)}/sec`;
        
    const isUltimate = upgrade.color === '#ffffff';
    const buttonTextColor = isUltimate ? 'text-black' : 'text-white';
    const buttonShadow = isUltimate ? 'hover:shadow-black/50' : 'hover:shadow-white/50';
    const isMaxLevel = upgrade.owned >= MAX_UPGRADE_LEVEL;

    return (
        <div id={id} className="bg-[var(--bg-upgrade)] p-2 my-1.5 rounded-lg w-[98%] mx-auto shadow-lg relative reveal">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex-grow">
                    <strong style={{ color: upgrade.color, textShadow: '1px 1px 1px #000' }}>
                        {upgrade.name} ({effectText})
                    </strong>
                    <div className="text-xs opacity-80 mt-1">
                        <span>Niveau: {upgrade.owned}/{MAX_UPGRADE_LEVEL}</span>
                        <span className="mx-2">|</span>
                        <span>{totalEffectText}</span>
                    </div>
                </div>
                <button 
                    onClick={onBuy} 
                    style={{ background: isMaxLevel ? '#555' : upgrade.color }} 
                    disabled={isMaxLevel}
                    className={`${buttonTextColor} px-2 py-1 rounded-md transition-all ${!isMaxLevel ? `hover:shadow-md ${buttonShadow}` : 'cursor-not-allowed'}`}
                >
                    {isMaxLevel ? 'MAX' : `Acheter (${formatNumber(upgrade.currentCost)})`}
                </button>
            </div>
            <div className="h-2.5 rounded-md bg-[#222] overflow-hidden mt-1.5">
                <div className="h-full rounded-md bg-gradient-to-r from-[#00ccff] to-[#0044ff] transition-all duration-300" style={{ width: `${Math.min((upgrade.owned / MAX_UPGRADE_LEVEL) * 100, 100)}%` }}></div>
            </div>
        </div>
    );
});

export default UpgradeItem;