import React, { useState, useEffect, useMemo } from 'react';
import { ShopUpgrade } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';
import ShopIconRenderer from '../ui/ShopIconRenderer';

interface PermanentUpgradeCardProps {
    purchasedShopUpgrades: string[];
    energy: number;
    quantumShards: number;
    hasUnseenShopItems: boolean;
    onBuy: (id: string) => void;
    formatNumber: (num: number) => string;
}

const PermanentUpgradeCard: React.FC<PermanentUpgradeCardProps> = ({
    purchasedShopUpgrades,
    energy,
    quantumShards,
    hasUnseenShopItems,
    onBuy,
    formatNumber
}) => {
    const [animationClass, setAnimationClass] = useState('');
    const [displayedUpgrade, setDisplayedUpgrade] = useState<ShopUpgrade | null>(null);

    const nextUnpurchasedUpgrade = useMemo(() => {
        return SHOP_UPGRADES.find(upg => !purchasedShopUpgrades.includes(upg.id));
    }, [purchasedShopUpgrades]);
    
    useEffect(() => {
        if (nextUnpurchasedUpgrade?.id !== displayedUpgrade?.id) {
            if (displayedUpgrade) {
                 setTimeout(() => {
                    setDisplayedUpgrade(nextUnpurchasedUpgrade || null);
                    setAnimationClass('animate-shop-card-enter');
                }, 300); // Must match animation duration
            } else {
                setDisplayedUpgrade(nextUnpurchasedUpgrade || null);
                setTimeout(() => setAnimationClass('animate-shop-card-enter'), 50);
            }
        }
    }, [nextUnpurchasedUpgrade, displayedUpgrade]);

    const handleBuyClick = (id: string) => {
        setAnimationClass('animate-shop-card-exit');
        setTimeout(() => {
            onBuy(id);
        }, 300); // Animation duration
    };

    if (!displayedUpgrade) {
        return (
             <div className="text-center text-sm opacity-70 mt-6 p-6 bg-black/40 backdrop-blur-sm border-2 border-yellow-500/30 rounded-xl animate-fade-in-fast text-yellow-200">
                <p>🏆</p>
                <p className="mt-2">Toutes les améliorations ont été achetées.</p>
                <p className="text-xs opacity-60 mt-1">De nouveaux articles pourraient apparaître à l'avenir.</p>
            </div>
        );
    }

    const canAfford = displayedUpgrade.currency === 'energy'
        ? energy >= displayedUpgrade.cost
        : quantumShards >= displayedUpgrade.cost;
    const buttonText = canAfford ? "Acheter" : "Fonds insuffisants";
    const currencySymbol = displayedUpgrade.currency === 'energy' ? '⚡' : '💠';

    return (
         <div className={`bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center relative shadow-lg shadow-yellow-500/10 ${animationClass}`}>
            {hasUnseenShopItems && (
                <div className="absolute -left-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvel article !"></div>
            )}
            <div className="w-16 h-16">
                <ShopIconRenderer iconId={displayedUpgrade.icon} className="w-full h-full" />
            </div>
            <div className="flex-grow text-center md:text-left">
                <h4 className="text-lg font-bold text-yellow-300">{displayedUpgrade.name}</h4>
                <p className="text-sm opacity-80 mt-1">{displayedUpgrade.description}</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <button
                    onClick={() => handleBuyClick(displayedUpgrade.id)}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform
                        ${canAfford
                            ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-black shadow-lg shadow-yellow-500/20 hover:brightness-110 hover:shadow-yellow-400/40 active:scale-95'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                     <span className="block">{buttonText}</span>
                     <span className="block text-xs opacity-80">({formatNumber(displayedUpgrade.cost)} {currencySymbol})</span>
                </button>
            </div>
        </div>
    );
};

export default PermanentUpgradeCard;