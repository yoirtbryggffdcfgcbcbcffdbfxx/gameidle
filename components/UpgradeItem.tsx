import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Upgrade } from '../types';
import { MAX_UPGRADE_LEVEL } from '../constants';
import { calculateBulkBuy, calculateTheoreticalBulkBuy } from '../utils/helpers';

interface UpgradeItemProps {
    id: string;
    upgrade: Upgrade;
    onBuy: () => void;
    formatNumber: (num: number) => string;
    energy: number;
    costMultiplier: number;
    buyAmount: 1 | 10 | 100 | 'MAX';
    efficiencyPercentage?: number;
    isMostEfficient: boolean;
    showEfficiencyPercentage: boolean;
    isNew?: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({ id, upgrade, onBuy, formatNumber, energy, costMultiplier, buyAmount, efficiencyPercentage, isMostEfficient, showEfficiencyPercentage, isNew }) => {
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

    // This is calculated based on energy and is the "real" purchasable amount.
    const purchaseInfo = useMemo(() => {
        return calculateBulkBuy(upgrade, buyAmount, energy, costMultiplier);
    }, [upgrade, buyAmount, energy, costMultiplier]);

    // This is calculated without energy and is for display purposes (full cost of a batch).
    const theoreticalPurchaseInfo = useMemo(() => {
        if (typeof buyAmount === 'number') {
            return calculateTheoreticalBulkBuy(upgrade, buyAmount, costMultiplier);
        }
        return null; // For 'MAX' mode
    }, [upgrade, buyAmount, costMultiplier]);

    // NEW `canAfford` logic. Simple and consistent.
    const canAfford = useMemo(() => {
        if (isMaxLevel) return false;
        // We can afford it if we can buy at least one upgrade in the current mode.
        return purchaseInfo.numToBuy > 0;
    }, [isMaxLevel, purchaseInfo.numToBuy]);

    // NEW `buttonText` logic.
    const buttonText = () => {
        if (isMaxLevel) return 'MAX';
    
        if (buyAmount === 'MAX') {
            // In MAX mode, we always show what's actually affordable.
            if (purchaseInfo.numToBuy > 0) {
                return `Acheter x${purchaseInfo.numToBuy} (${formatNumber(purchaseInfo.totalCost)})`;
            }
            // If we can't afford even one. Button is disabled. Show cost of next level.
            return `Coût: ${formatNumber(upgrade.currentCost)}`;
        }
        
        // For numeric amounts (x1, x10, x100)
        if (theoreticalPurchaseInfo) {
            if (theoreticalPurchaseInfo.numToBuy === 0) return 'MAX';
    
            // If we can afford a partial amount, show that. This is more honest.
            if (purchaseInfo.numToBuy > 0 && purchaseInfo.numToBuy < theoreticalPurchaseInfo.numToBuy) {
                 return `Acheter x${purchaseInfo.numToBuy} (${formatNumber(purchaseInfo.totalCost)})`;
            } else {
                // We can't afford any OR we can afford the full batch. Show the full theoretical cost.
                // The button's disabled state will differentiate the two cases.
                return `Acheter x${theoreticalPurchaseInfo.numToBuy} (${formatNumber(theoreticalPurchaseInfo.totalCost)})`;
            }
        }
    
        return 'Acheter'; // Fallback
    };

    const isClickUpgrade = upgrade.type === 'CLICK';
    const isBoosterUpgrade = upgrade.type === 'BOOSTER';

    const effectText = isClickUpgrade
        ? `+${formatNumber(upgrade.production)} par clic`
        : isBoosterUpgrade
            ? `+${upgrade.production}% Prod. Totale`
            : `${formatNumber(upgrade.production)}/sec`;

    const totalEffectText = isClickUpgrade
        ? `Bonus Clic: +${formatNumber(upgrade.production * upgrade.owned)}`
        : isBoosterUpgrade
            ? `Bonus Prod: +${upgrade.production * upgrade.owned}%`
            : `Prod: ${formatNumber(upgrade.production * upgrade.owned)}/sec`;
        
    const isUltimate = upgrade.color === '#ffffff';
    const buttonTextColor = isUltimate ? 'text-black' : 'text-white';
    const buttonShadow = isUltimate ? 'hover:shadow-black/50' : 'hover:shadow-white/50';

    const containerClasses = [
        "bg-[var(--bg-upgrade)] p-2 my-0.5 rounded-lg w-[98%] mx-auto shadow-lg relative transition-all duration-500",
        isMostEfficient ? 'border-2 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.7)]' : 'border-2 border-transparent',
        'opacity-0 translate-y-5',
        isOnScreen ? 'opacity-100 translate-y-0' : '',
    ].join(' ');
    
    const isButtonDisabled = isMaxLevel || !canAfford;

    const buttonDynamicClasses = isButtonDisabled
        ? 'cursor-not-allowed'
        : `hover:shadow-md ${buttonShadow} ${!isButtonDisabled ? 'active:scale-95 active:brightness-90' : ''}`;


    return (
        <div ref={containerRef} id={id} className={containerClasses}>
            {isNew && (
                <div className="absolute -left-1 top-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-red" title="Nouvelle amélioration disponible !"></div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex-grow">
                    <strong style={{ color: upgrade.color, textShadow: '1px 1px 1px #000' }}>
                        {upgrade.name} <span className="text-xs opacity-80">({effectText})</span>
                    </strong>
                    <div className="text-xs opacity-80 mt-1 flex flex-wrap gap-x-2">
                        <span>Niveau: {upgrade.owned}/{MAX_UPGRADE_LEVEL}</span>
                        <span>|</span>
                        <span>{totalEffectText}</span>
                        {showEfficiencyPercentage && efficiencyPercentage !== undefined && efficiencyPercentage > 0 && (
                             <>
                                <span>|</span>
                                <span title="Efficacité par rapport à la meilleure option">📊 {efficiencyPercentage.toFixed(0)}%</span>
                             </>
                        )}
                    </div>
                </div>
                <button 
                    onClick={onBuy} 
                    style={{ background: isMaxLevel ? '#555' : (canAfford ? upgrade.color : '#444') }} 
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