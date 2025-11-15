import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Upgrade } from '../types';
import { MAX_UPGRADE_LEVEL } from '../constants';
import { calculateBulkBuy, calculateTheoreticalBulkBuy, calculateCost } from '../utils/helpers';

interface UpgradeItemProps {
    id: string;
    upgrade: Upgrade;
    onBuy: (amount: 1 | 10 | 100 | 'MAX') => void;
    onBuyTier: () => void;
    formatNumber: (num: number) => string;
    energy: number;
    costMultiplier: number;
    buyAmount: 1 | 10 | 100 | 'MAX';
    efficiencyPercentage?: number;
    isMostEfficient: boolean;
    showEfficiencyPercentage: boolean;
    isNew?: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({ id, upgrade, onBuy, onBuyTier, formatNumber, energy, costMultiplier, buyAmount, efficiencyPercentage, isMostEfficient, showEfficiencyPercentage, isNew }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsOnScreen(true);
                if (containerRef.current) {
                    observer.unobserve(containerRef.current);
                }
            }
        }, { threshold: 0.1 });

        const currentRef = containerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const isMaxLevel = upgrade.owned >= MAX_UPGRADE_LEVEL;
    // FIX: The condition for being at a tier threshold now also checks if the tier for that level has already been purchased.
    // This prevents the "Upgrade Tier" button from showing incorrectly after a purchase.
    const isAtTierThreshold = upgrade.owned > 0 && upgrade.owned % 10 === 0 && !isMaxLevel && upgrade.tier < upgrade.owned / 10;

    // --- Calculations ---
    const currentProductionPerUnit = useMemo(() => upgrade.baseProduction * Math.pow(2, upgrade.tier), [upgrade.baseProduction, upgrade.tier]);
    const tierUpgradeCost = useMemo(() => calculateCost(upgrade.baseCost, upgrade.owned, costMultiplier) * 10, [upgrade, costMultiplier]);

    // This is calculated based on energy and is the "real" purchasable amount for normal levels.
    const purchaseInfo = useMemo(() => {
        if (isAtTierThreshold) return { numLevelsBought: 0, totalCost: 0 };
        return calculateBulkBuy(upgrade, buyAmount, energy, costMultiplier);
    }, [upgrade, buyAmount, energy, costMultiplier, isAtTierThreshold]);

    // This is calculated without energy and is for display purposes (full cost of a batch).
    const theoreticalPurchaseInfo = useMemo(() => {
        if (isAtTierThreshold || typeof buyAmount !== 'number') return null;
        return calculateTheoreticalBulkBuy(upgrade, buyAmount, costMultiplier);
    }, [upgrade, buyAmount, costMultiplier, isAtTierThreshold]);

    const canAfford = useMemo(() => {
        if (isMaxLevel) return false;
        if (isAtTierThreshold) return energy >= tierUpgradeCost;
        return purchaseInfo.numLevelsBought > 0;
    }, [isMaxLevel, isAtTierThreshold, energy, tierUpgradeCost, purchaseInfo.numLevelsBought]);

    // --- Display Logic ---
    const chevrons = '>'.repeat(upgrade.tier);

    const buttonText = () => {
        if (isMaxLevel) return 'MAX';
        if (isAtTierThreshold) return `Améliorer Seuil (${formatNumber(tierUpgradeCost)})`;
    
        if (buyAmount === 'MAX') {
            if (purchaseInfo.numLevelsBought > 0) return `Acheter x${purchaseInfo.numLevelsBought} (${formatNumber(purchaseInfo.totalCost)})`;
            return `Coût: ${formatNumber(upgrade.currentCost)}`;
        }
        
        if (theoreticalPurchaseInfo) {
            if (theoreticalPurchaseInfo.numToBuy === 0) return 'MAX';
            if (purchaseInfo.numLevelsBought > 0 && purchaseInfo.numLevelsBought < theoreticalPurchaseInfo.numToBuy) {
                 return `Acheter x${purchaseInfo.numLevelsBought} (${formatNumber(purchaseInfo.totalCost)})`;
            } else {
                return `Acheter x${theoreticalPurchaseInfo.numToBuy} (${formatNumber(theoreticalPurchaseInfo.totalCost)})`;
            }
        }
    
        return 'Acheter';
    };

    const isClickUpgrade = upgrade.type === 'CLICK';
    const isBoosterUpgrade = upgrade.type === 'BOOSTER';

    const effectText = isClickUpgrade
        ? `+${formatNumber(currentProductionPerUnit)} par clic`
        : isBoosterUpgrade
            ? `+${formatNumber(currentProductionPerUnit)}% Prod. Totale`
            : `${formatNumber(currentProductionPerUnit)}/sec`;

    const totalEffectText = isClickUpgrade
        ? `Bonus Clic: +${formatNumber(currentProductionPerUnit * upgrade.owned)}`
        : isBoosterUpgrade
            ? `Bonus Prod: +${formatNumber(currentProductionPerUnit * upgrade.owned)}%`
            : `Prod: ${formatNumber(currentProductionPerUnit * upgrade.owned)}/sec`;
        
    const isUltimate = upgrade.color === '#ffffff';
    const buttonTextColor = isUltimate ? 'text-black' : 'text-white';
    const buttonShadow = isUltimate ? 'hover:shadow-black/50' : 'hover:shadow-white/50';

    const containerClasses = [
        "bg-[var(--bg-upgrade)] p-2 my-0.5 rounded-lg w-[98%] mx-auto shadow-lg relative transition-all duration-500",
        isMostEfficient ? 'border-2 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.7)]' : 'border-2 border-transparent',
        isAtTierThreshold ? 'border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.7)]' : '',
        'opacity-0 translate-y-5',
        isOnScreen ? 'opacity-100 translate-y-0' : '',
    ].join(' ');
    
    const isButtonDisabled = isMaxLevel || !canAfford;

    const buttonDynamicClasses = isButtonDisabled
        ? 'cursor-not-allowed'
        : `hover:shadow-md ${buttonShadow} ${!isButtonDisabled ? 'active:scale-95 active:brightness-90' : ''}`;

    const buttonBgColor = () => {
        if (isMaxLevel) return '#555';
        if (!canAfford) return '#444';
        return isAtTierThreshold ? '#eab308' : upgrade.color;
    };

    return (
        <div ref={containerRef} id={id} className={containerClasses}>
            {isNew && (
                <div className="absolute -left-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvelle amélioration disponible !"></div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex-grow">
                    <strong style={{ color: upgrade.color, textShadow: '1px 1px 1px #000' }}>
                        {chevrons && <span className="text-yellow-400 mr-1">{chevrons}</span>}
                        {upgrade.name} <span className="text-xs opacity-80">({effectText})</span>
                    </strong>
                    <div className="text-xs opacity-80 mt-1 flex flex-wrap gap-x-2">
                        <span>Niveau: {upgrade.owned}/{MAX_UPGRADE_LEVEL}</span>
                        <span>|</span>
                        <span>{totalEffectText}</span>
                        {isAtTierThreshold && (
                             <>
                                <span>|</span>
                                <span className="text-yellow-400 animate-pulse">Bonus Seuil: Prod x2 !</span>
                             </>
                        )}
                        {showEfficiencyPercentage && efficiencyPercentage !== undefined && efficiencyPercentage > 0 && !isAtTierThreshold && (
                             <>
                                <span>|</span>
                                <span title="Efficacité par rapport à la meilleure option">📊 {efficiencyPercentage.toFixed(0)}%</span>
                             </>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => isAtTierThreshold ? onBuyTier() : onBuy(buyAmount)} 
                    style={{ background: buttonBgColor() }} 
                    disabled={isButtonDisabled}
                    className={`${buttonTextColor} px-6 sm:px-2 py-1.5 sm:py-0.5 rounded-md transition-all text-xs ${buttonDynamicClasses} w-auto self-center sm:self-auto`}
                >
                    {buttonText()}
                </button>
            </div>
            <div className="h-1.5 rounded-md bg-[#222] overflow-hidden mt-2">
                <div className="h-full rounded-md bg-gradient-to-r from-[#00ccff] to-[#0044ff] transition-all duration-300" style={{ width: `${Math.min((upgrade.owned / MAX_UPGRADE_LEVEL) * 100, 100)}%` }}></div>
            </div>
        </div>
    );
});

export default UpgradeItem;