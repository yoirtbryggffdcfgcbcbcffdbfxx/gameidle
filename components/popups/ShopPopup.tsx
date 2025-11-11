import React from 'react';
import { ShopUpgrade } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';

interface ShopPopupProps {
    quantumShards: number;
    energy: number;
    purchasedShopUpgrades: string[];
    onBuy: (id: string) => void;
    formatNumber: (num: number) => string;
}

const ShopItemCard: React.FC<{
    upgrade: ShopUpgrade;
    isPurchased: boolean;
    canAfford: boolean;
    onBuy: () => void;
    formatNumber: (num: number) => string;
}> = ({ upgrade, isPurchased, canAfford, onBuy, formatNumber }) => {
    
    let buttonText = "Acheter";
    if (isPurchased) buttonText = "Acheté";
    else if (!canAfford) buttonText = "Fonds insuffisants";
    
    const currencySymbol = upgrade.currency === 'energy' ? '⚡' : 'FQ';

    return (
        <div className={`bg-[var(--bg-upgrade)] p-3 rounded-lg flex flex-col md:flex-row gap-4 items-center ${isPurchased ? 'opacity-60' : ''}`}>
            <div className="text-4xl">
                {upgrade.icon}
            </div>
            <div className="flex-grow text-center md:text-left">
                <h4 className="text-base font-bold text-yellow-400">{upgrade.name}</h4>
                <p className="text-xs opacity-80 mt-1">{upgrade.description}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <button
                    onClick={onBuy}
                    disabled={isPurchased || !canAfford}
                    className={`w-full px-4 py-2 rounded-md text-xs font-bold transition-colors
                        ${isPurchased ? 'bg-green-800 cursor-not-allowed' : ''}
                        ${!isPurchased && canAfford ? 'bg-cyan-700 hover:bg-cyan-600' : ''}
                        ${!isPurchased && !canAfford ? 'bg-red-900 cursor-not-allowed' : ''}
                    `}
                >
                    {buttonText} ({formatNumber(upgrade.cost)} {currencySymbol})
                </button>
            </div>
        </div>
    );
};


const ShopPopup: React.FC<ShopPopupProps> = ({ quantumShards, energy, purchasedShopUpgrades, onBuy, formatNumber }) => {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl text-center text-[var(--text-header)] mb-4">Boutique Permanente</h2>
            <div className="space-y-4 flex-grow overflow-hidden flex flex-col">
                 <div className="bg-black/30 p-2 rounded-lg text-center text-xs">
                    <p>Les améliorations achetées ici sont permanentes et persistent à travers les Ascensions.</p>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mt-2">
                    <div className="space-y-3">
                        {SHOP_UPGRADES.map(upgrade => {
                            const isPurchased = purchasedShopUpgrades.includes(upgrade.id);
                            const canAfford = upgrade.currency === 'energy'
                                ? energy >= upgrade.cost
                                : quantumShards >= upgrade.cost;
                            return (
                                <ShopItemCard
                                    key={upgrade.id}
                                    upgrade={upgrade}
                                    isPurchased={isPurchased}
                                    canAfford={canAfford}
                                    onBuy={() => onBuy(upgrade.id)}
                                    formatNumber={formatNumber}
                                />
                            );
                        })}
                    </div>
                     <div className="text-center text-xs opacity-50 mt-6">
                        <p>De nouveaux articles apparaîtront bientôt.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPopup;