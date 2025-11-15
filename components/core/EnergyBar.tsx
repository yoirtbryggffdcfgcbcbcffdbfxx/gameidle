import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../../data/core';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../../data/shop';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../../data/bank';

const ShopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);
const CoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="1.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(-60 12 12)" />
    </svg>
);
const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);


const EnergyBar: React.FC = () => {
    const { gameState, computedState, memoizedFormatNumber } = useGameContext();
    const { energy, isCoreUnlocked, isShopUnlocked, isBankUnlocked } = gameState;
    const { displayMaxEnergy } = computedState;

    let currentGoalText: string = '';
    let GoalIcon: React.FC | null = null;
    let goalEnergy = 0;

    if (!isShopUnlocked) {
        currentGoalText = 'La Boutique !';
        GoalIcon = ShopIcon;
        goalEnergy = SHOP_UNLOCK_TOTAL_ENERGY;
    } else if (!isCoreUnlocked) {
        currentGoalText = 'Le Cœur Quantique !';
        GoalIcon = CoreIcon;
        goalEnergy = CORE_UNLOCK_TOTAL_ENERGY;
    } else if (!isBankUnlocked) {
        currentGoalText = 'La Banque !';
        GoalIcon = BankIcon;
        goalEnergy = BANK_UNLOCK_TOTAL_ENERGY;
    }

    const energyPercentage = Math.min((energy / displayMaxEnergy) * 100, 100);
    
    const barText = `${memoizedFormatNumber(energy)} / ${memoizedFormatNumber(displayMaxEnergy)}`;
    const textBelowBar = currentGoalText ? `Objectif : ${currentGoalText}` : 'Énergie';

    return (
        <>
            <div id="energy-bar-container" className="relative w-full h-8 bg-black/50 rounded-full overflow-hidden shadow-inner border-2 border-cyan-800/50">
                <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                <div className="absolute w-full h-full flex items-center justify-center text-sm [text-shadow:1px_1px_2px_#000] font-bold">
                    {barText}
                </div>

                {GoalIcon && (
                    <div className="group absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center">
                        <div className="animate-float text-cyan-300">
                            <GoalIcon />
                        </div>
                        {/* Tooltip is now hidden on mobile */}
                        <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 w-max mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {`Objectif : ${currentGoalText.replace(' !', '')} (${memoizedFormatNumber(goalEnergy)} Énergie)`}
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center text-xs opacity-70">{textBelowBar}</div>
        </>
    );
};

export default EnergyBar;