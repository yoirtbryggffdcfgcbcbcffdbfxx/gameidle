import React from 'react';

interface UpgradeStatsProps {
    name: string;
    owned: number;
    color: string;
    productionValue: string;
    productionLabel: string;
    totalProductionValue: string;
    isAtTierThreshold: boolean;
    isBoosterUpgrade: boolean;
}

const UpgradeStats: React.FC<UpgradeStatsProps> = ({
    name,
    owned,
    color,
    productionValue,
    productionLabel,
    totalProductionValue,
    isAtTierThreshold,
    isBoosterUpgrade
}) => {
    const MAX_UPGRADE_LEVEL = 1000;
    const TIER_PRODUCTION_MULTIPLIER = 3;
    const TIER_BOOSTER_MULTIPLIER = 2;

    return (
        <div className="flex-grow p-3 flex flex-col justify-between relative overflow-hidden">
            {/* Progress Bar Background */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gray-800 w-full z-0">
                <div
                    className="h-full transition-all duration-500 ease-out shadow-[0_0_5px_currentColor]"
                    style={{
                        width: `${Math.min((owned / MAX_UPGRADE_LEVEL) * 100, 100)}%`,
                        backgroundColor: color
                    }}
                />
            </div>

            {/* Header Line */}
            <div className="flex justify-between items-start mb-1 relative z-10">
                <h3 className="font-bold text-sm text-gray-200 leading-tight group-hover:text-white transition-colors">
                    {name}
                </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mt-1 relative z-10">
                <div className="bg-black/40 rounded px-2 py-1 border border-white/5">
                    <span className="block text-[9px] text-gray-500 uppercase">Niveau</span>
                    <span className="block text-xs font-mono text-white">
                        {owned} <span className="text-[9px] text-gray-600">/ {MAX_UPGRADE_LEVEL}</span>
                    </span>
                </div>

                {/* Unit Output Display */}
                <div className="bg-black/40 rounded px-2 py-1 border border-white/5">
                    <span className="block text-[9px] text-gray-500 uppercase">Unitaire</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs font-mono text-cyan-300">{productionValue}</span>
                        <span className="text-[9px] text-gray-500">{productionLabel}</span>
                    </div>
                </div>

                {/* Total Output Display */}
                <div className="bg-black/40 rounded px-2 py-1 border border-white/5">
                    <span className="block text-[9px] text-gray-500 uppercase">Total</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs font-mono text-gray-300">{totalProductionValue}</span>
                    </div>
                </div>
            </div>

            {/* Tier Warning Overlay */}
            {isAtTierThreshold && (
                <div className="absolute inset-x-0 bottom-2 mx-3 bg-yellow-900/90 border border-yellow-500/50 rounded px-2 py-2 text-center animate-pulse z-30 shadow-lg backdrop-blur-sm">
                    <div className="text-[10px] font-bold text-yellow-200 uppercase tracking-wide mb-0.5">
                        ⚠️ Surcharge Requise
                    </div>
                    <div className="text-xs font-mono text-white">
                        {isBoosterUpgrade ? `Puissance x${TIER_BOOSTER_MULTIPLIER}` : `Output x${TIER_PRODUCTION_MULTIPLIER}`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpgradeStats;
