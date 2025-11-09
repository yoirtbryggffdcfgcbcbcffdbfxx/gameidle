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
    productionContribution?: number;
    isMostEfficient: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo(({ id, upgrade, onBuy, formatNumber, energy, costMultiplier, buyAmount, productionContribution, isMostEfficient }) => {
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

    const purchaseInfo = useMemo(() => {
        return calculateBulkBuy(upgrade, buyAmount, energy, costMultiplier);
    }, [upgrade, buyAmount, energy, costMultiplier]);

    const theoreticalPurchaseInfo = useMemo(() => {
        if (typeof buyAmount === 'number') {
            return calculateTheoreticalBulkBuy(upgrade, buyAmount, costMultiplier);
        }
        return null;
    }, [upgrade, buyAmount, costMultiplier]);

    const canAfford = useMemo(() => {
        if (isMaxLevel) return false;

        if (buyAmount === 'MAX') {
            return purchaseInfo.numToBuy > 0;
        }

        if (theoreticalPurchaseInfo) {
            return energy >= theoreticalPurchaseInfo.totalCost;
        }

        return false;
    }, [isMaxLevel, buyAmount, purchaseInfo.numToBuy, theoreticalPurchaseInfo, energy]);

    const buttonText = () => {
        if (isMaxLevel) return 'MAX';

        // "Fonds insuffisants" is only shown if you can't afford a single level in x1 or MAX mode.
        if (energy < upgrade.currentCost && (buyAmount === 1 || buyAmount === 'MAX')) {
            return 'Fonds insuffisants';
        }

        if (buyAmount === 'MAX') {
            // We know we can afford at least one because of the check above.
            return `Acheter x${purchaseInfo.numToBuy} (${formatNumber(purchaseInfo.totalCost)})`;
        }
        
        if (theoreticalPurchaseInfo) {
            if (theoreticalPurchaseInfo.numToBuy === 0) return 'MAX';
            // For x1, x10, x100, always show the theoretical cost.
            // The button's disabled state is handled by the `canAfford` check.
            return `Acheter x${theoreticalPurchaseInfo.numToBuy} (${formatNumber(theoreticalPurchaseInfo.totalCost)})`;
        }

        // Fallback for an affordable x1
        return 'Acheter';
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
        "bg-[var(--bg-upgrade)] p-1 my-0.5 rounded-lg w-[98%] mx-auto shadow-lg relative transition-all duration-500",
        isMostEfficient ? 'border-2 border-green-500 shadow-[0_0_15px_rgba(74,222,128,0.7)]' : 'border-2 border-transparent',
        'opacity-0 translate-y-5',
        isOnScreen ? 'opacity-100 translate-y-0' : '',
    ].join(' ');

    return (
        <div ref={containerRef} id={id} className={containerClasses}>
            <div className="flex justify-between items-center flex-wrap gap-1">
                <div className="flex-grow">
                    <strong style={{ color: upgrade.color, textShadow: '1px 1px 1px #000' }}>
                        {upgrade.name} <span className="text-xs opacity-80">({effectText})</span>
                    </strong>
                    <div className="text-xs opacity-80 mt-1 flex flex-wrap gap-x-2">
                        <span>Niveau: {upgrade.owned}/{MAX_UPGRADE_LEVEL}</span>
                        <span>|</span>
                        <span>{totalEffectText}</span>
                        {productionContribution !== undefined && productionContribution > 0 && (
                             <>
                                <span>|</span>
                                <span title="Contribution à la production totale">📊 {productionContribution.toFixed(1)}%</span>
                             </>
                        )}
                    </div>
                </div>
                <button 
                    onClick={onBuy} 
                    style={{ background: isMaxLevel ? '#555' : (canAfford ? upgrade.color : '#444') }} 
                    disabled={isMaxLevel || !canAfford}
                    className={`${buttonTextColor} px-2 py-0.5 rounded-md transition-all text-xs ${!isMaxLevel ? `hover:shadow-md ${buttonShadow}` : 'cursor-not-allowed'} ${!canAfford && !isMaxLevel ? 'cursor-not-allowed' : ''}`}
                >
                    {buttonText()}
                </button>
            </div>
            <div className="h-1.5 rounded-md bg-[#222] overflow-hidden mt-1">
                <div className="h-full rounded-md bg-gradient-to-r from-[#00ccff] to-[#0044ff] transition-all duration-300" style={{ width: `${Math.min((upgrade.owned / MAX_UPGRADE_LEVEL) * 100, 100)}%` }}></div>
            </div>
        </div>
    );
});

export default UpgradeItem;
