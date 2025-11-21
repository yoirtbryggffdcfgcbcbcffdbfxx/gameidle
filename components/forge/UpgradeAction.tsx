
import React from 'react';

interface UpgradeActionProps {
    isMaxLevel: boolean;
    isAtTierThreshold: boolean;
    canAfford: boolean;
    tierUpgradeCost: number;
    purchaseCost: number;
    purchaseCount: number;
    onBuy: () => void;
    onBuyTierUpgrade: () => void;
    formatNumber: (num: number) => string;
}

const UpgradeAction: React.FC<UpgradeActionProps> = ({
    isMaxLevel,
    isAtTierThreshold,
    canAfford,
    tierUpgradeCost,
    purchaseCost,
    purchaseCount,
    onBuy,
    onBuyTierUpgrade,
    formatNumber
}) => {
    
    const getButtonContent = () => {
        if (isMaxLevel) return <span className="text-gray-400 font-bold">MAX</span>;
        
        if (isAtTierThreshold) {
            return (
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-yellow-900">ÉVOLUTION</span>
                    <span className="font-mono text-xs">{formatNumber(tierUpgradeCost)} ⚡</span>
                </div>
            );
        }
    
        return (
            <div className="flex flex-col items-center">
                <span className={`text-[10px] font-bold ${canAfford ? 'text-black/70' : 'text-white/50'}`}>ACHETER x{purchaseCount}</span>
                <span className="font-mono text-xs font-bold">{formatNumber(purchaseCost)} ⚡</span>
            </div>
        );
    };

    // Logic for interactivity and styles
    const isDisabled = isMaxLevel || !canAfford;
    const handleClick = isAtTierThreshold ? onBuyTierUpgrade : onBuy;

    const baseClasses = "w-full h-full min-h-[40px] rounded flex items-center justify-center transition-all duration-200";
    let stateClasses = "";

    if (isMaxLevel) {
        stateClasses = "bg-transparent border border-gray-800 cursor-default";
    } else if (isAtTierThreshold) {
        stateClasses = "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse cursor-pointer";
    } else if (canAfford) {
        stateClasses = "bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] active:scale-95 cursor-pointer";
    } else {
        // Disabled state with stripes and shake animation on hover
        stateClasses = "bg-gray-800/50 text-gray-500 border border-gray-700 cursor-not-allowed bg-striped hover:animate-shake";
    }

    return (
        <div className="p-2 sm:p-3 flex items-center justify-center sm:min-w-[120px] border-t sm:border-t-0 sm:border-l border-white/5 bg-black/10">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`${baseClasses} ${stateClasses}`}
            >
                {getButtonContent()}
            </button>
        </div>
    );
};

export default UpgradeAction;
