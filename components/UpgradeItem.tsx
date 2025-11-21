
import React, { useRef, useState, useEffect } from 'react';
import { Upgrade } from '../types';
import { useUpgradeCalculations } from '../hooks/ui/useUpgradeCalculations';
import UpgradeIcon from './forge/UpgradeIcon';
import UpgradeStats from './forge/UpgradeStats';
import UpgradeAction from './forge/UpgradeAction';

interface UpgradeItemProps {
    id: string;
    upgrade: Upgrade;
    onBuy: (amount: 1 | 10 | 100 | 'MAX') => void;
    onBuyTierUpgrade: () => void;
    formatNumber: (num: number) => string;
    energy: number;
    costMultiplier: number;
    buyAmount: 1 | 10 | 100 | 'MAX';
    efficiencyPercentage?: number;
    isMostEfficient: boolean;
    showEfficiencyPercentage: boolean;
    isNew?: boolean;
}

const UpgradeItem: React.FC<UpgradeItemProps> = React.memo((props) => {
    const { id, upgrade, onBuy, onBuyTierUpgrade, formatNumber, isMostEfficient, showEfficiencyPercentage, efficiencyPercentage, isNew } = props;
    
    // UI Logic: Visibility on Scroll
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsOnScreen(true);
                if (containerRef.current) observer.unobserve(containerRef.current);
            }
        }, { threshold: 0.1 });

        const currentRef = containerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    // Business Logic extracted to Hook
    const calc = useUpgradeCalculations({
        upgrade: props.upgrade,
        energy: props.energy,
        costMultiplier: props.costMultiplier,
        buyAmount: props.buyAmount,
        formatNumber: props.formatNumber
    });

    const containerClasses = [
        "group relative flex flex-col sm:flex-row items-stretch bg-[#111] rounded-md overflow-hidden transition-all duration-300 w-full max-w-full",
        "border-l-4 shadow-lg hover:bg-[#161616]",
        isMostEfficient ? 'ring-1 ring-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.1)]' : '',
        calc.isAtTierThreshold ? 'ring-2 ring-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)] z-20 scale-[1.01]' : 'border-opacity-50',
        isOnScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
    ].join(' ');

    return (
        <div ref={containerRef} id={id} className={containerClasses} style={{ borderLeftColor: upgrade.color }}>
            
            {/* NEW Badge */}
            {isNew && (
                <div className="absolute -left-1 -top-1 z-30 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </div>
            )}

            {/* Efficiency Badge */}
            {showEfficiencyPercentage && efficiencyPercentage !== undefined && efficiencyPercentage > 0 && !calc.isAtTierThreshold && !calc.isMaxLevel && (
                <div className="absolute top-2 right-2 z-10 bg-gray-900/80 border border-gray-700 rounded px-1.5 py-0.5 text-[10px] text-green-400 font-mono shadow-sm backdrop-blur-sm pointer-events-none">
                    {efficiencyPercentage.toFixed(0)}% EFF
                </div>
            )}

            <UpgradeIcon 
                type={upgrade.type} 
                color={upgrade.color} 
                tierRank={`MK-${upgrade.tier + 1}`} 
            />

            <UpgradeStats 
                name={upgrade.name}
                owned={upgrade.owned}
                color={upgrade.color}
                productionValue={calc.productionValue}
                productionLabel={calc.productionLabel}
                totalProductionValue={calc.totalProductionValue}
                projectedGainLabel={calc.projectedGainLabel}
                isAtTierThreshold={calc.isAtTierThreshold}
                isBoosterUpgrade={calc.isBoosterUpgrade}
                buyAmount={props.buyAmount}
            />

            <UpgradeAction 
                isMaxLevel={calc.isMaxLevel}
                isAtTierThreshold={calc.isAtTierThreshold}
                canAfford={calc.canAfford}
                tierUpgradeCost={calc.tierUpgradeCost}
                purchaseCost={calc.purchaseCost}
                purchaseCount={calc.purchaseCount}
                onBuy={() => onBuy(props.buyAmount)}
                onBuyTierUpgrade={onBuyTierUpgrade}
                formatNumber={formatNumber}
            />
        </div>
    );
});

export default UpgradeItem;
