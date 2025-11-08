
import React from 'react';
import { Upgrade } from '../types';

interface UpgradeItemProps {
    upgrade: Upgrade;
    onBuy: () => void;
    formatNumber: (num: number) => string;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({ upgrade, onBuy, formatNumber }) => {
    return (
        <div className="bg-[var(--bg-upgrade)] p-2 my-1.5 rounded-lg w-[98%] mx-auto shadow-lg relative">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex-grow">
                    <strong style={{ color: upgrade.color, textShadow: '1px 1px 1px #000' }}>
                        {upgrade.name} ({formatNumber(upgrade.production)}/sec)
                    </strong>
                    <div className="text-xs opacity-80 mt-1">
                        <span>Possédés: {upgrade.owned}</span>
                        <span className="mx-2">|</span>
                        <span>Prod. Totale: {formatNumber(upgrade.production * upgrade.owned)}/sec</span>
                    </div>
                </div>
                <button onClick={onBuy} style={{ background: upgrade.color }} className="text-white px-2 py-1 rounded-md hover:shadow-md hover:shadow-white/50 transition-shadow">
                    Acheter ({formatNumber(upgrade.currentCost)})
                </button>
            </div>
            <div className="h-2.5 rounded-md bg-[#222] overflow-hidden mt-1.5">
                <div className="h-full rounded-md bg-gradient-to-r from-[#00ccff] to-[#0044ff] transition-all duration-300" style={{ width: `${Math.min(upgrade.owned * 2, 100)}%` }}></div>
            </div>
        </div>
    );
});

export default UpgradeItem;
