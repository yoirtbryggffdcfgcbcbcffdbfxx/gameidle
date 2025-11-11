import React from 'react';
import Logo from './Logo';
import { useGameContext } from '../contexts/GameContext';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../data/core';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../data/shop';
import QuantumCore from './QuantumCore';
import { formatDuration } from '../utils/helpers';

const AIAvatar: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="50" height="50" viewBox="0 0 100 100" className={`flex-shrink-0 ${className}`}>
        <defs>
            <radialGradient id="ai-grad-core" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#0b022d" />
            </radialGradient>
            <filter id="ai-glow-core" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#ai-glow-core)">
            <path d="M 20 50 A 30 30 0 1 1 80 50 L 80 80 A 30 30 0 1 1 20 80 Z" fill="#222" stroke="#00f5d4" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="url(#ai-grad-core)" />
            <circle cx="50" cy="50" r="5" fill="#fff" />
        </g>
    </svg>
);

interface StatDisplayProps {
    label: string;
    value: string;
    icon: string;
    colorClass: string;
    showRepaymentIndicator?: boolean;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, icon, colorClass, showRepaymentIndicator }) => (
    <div className={`bg-black/30 p-2 rounded-lg text-center ${colorClass}`}>
        <div className="text-xs opacity-80">{icon} {label}</div>
        <div className="text-base md:text-lg font-bold flex justify-center items-center gap-2">
            <span>{value}</span>
            {showRepaymentIndicator && (
                <div className="relative group">
                    <span className="text-red-500 text-xs animate-pulse cursor-help">(-50%)</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-max mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">
                        50% de la production rembourse votre prêt.
                    </div>
                </div>
            )}
        </div>
    </div>
);

const CoreSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    const { energy, currentLoan, purchasedShopUpgrades, isCoreUnlocked, isShopUnlocked, coreCharge, isCoreDischarging } = gameState;
    const { maxEnergy, productionTotal, clickPower, avgProductionLast10s, coreBonuses, timeToFullSeconds } = computedState;
    const { onCollect, onDischargeCore, enterQuantumInterface } = handlers;
    
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

    const handleCoreInteraction = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
        if (coreCharge >= 100) {
            onDischargeCore(e);
        } else {
            enterQuantumInterface(e);
        }
    };

    const showEPSMeter = purchasedShopUpgrades.includes('eps_meter');

    // Determine the current goal for the energy bar based on the new energy-based unlock system
    let currentGoal: { value: number; text: string; };
    if (!isShopUnlocked) {
        currentGoal = { value: SHOP_UNLOCK_TOTAL_ENERGY, text: 'La Boutique !' };
    } else if (!isCoreUnlocked) {
        currentGoal = { value: CORE_UNLOCK_TOTAL_ENERGY, text: 'Le Cœur Quantique !' };
    } else {
        currentGoal = { value: maxEnergy, text: '' };
    }
    const displayMaxEnergy = currentGoal.value;
    const energyPercentage = Math.min((energy / displayMaxEnergy) * 100, 100);
    
    // SWAPPED LOGIC based on user request
    const barText = `${memoizedFormatNumber(energy)} / ${memoizedFormatNumber(displayMaxEnergy)}`;
    const textBelowBar = currentGoal.text ? `Objectif : ${currentGoal.text}` : 'Énergie';
    const showCoreReadyNotification = coreCharge >= 100 && !isCoreDischarging;

    return (
        <section id="core" className="fullscreen-section reveal">
            <div className="text-center flex flex-col items-center justify-between h-full py-8 w-full max-w-lg">
                <Logo />
                <div className="w-full space-y-3">
                    <div id="energy-bar-container" className="relative w-full h-8 bg-black/50 rounded-full overflow-hidden shadow-inner border-2 border-cyan-800/50">
                        <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                        <div className="absolute w-full h-full flex items-center justify-center text-sm [text-shadow:1px_1px_2px_#000] font-bold">
                            {barText}
                        </div>

                        {!isCoreUnlocked && (
                            <div className="group absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center">
                                <div className="animate-float text-cyan-300">
                                    {!isShopUnlocked ? <ShopIcon /> : <CoreIcon />}
                                </div>
                                {/* Tooltip is now hidden on mobile */}
                                <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 w-max mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {!isShopUnlocked 
                                        ? `Objectif : La Boutique (${memoizedFormatNumber(SHOP_UNLOCK_TOTAL_ENERGY)} Énergie)`
                                        : `Objectif : Le Cœur Quantique (${memoizedFormatNumber(CORE_UNLOCK_TOTAL_ENERGY)} Énergie)`
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center text-xs opacity-70">{textBelowBar}</div>
                    
                    {isCoreUnlocked && (
                        <div className="my-2 relative w-min mx-auto">
                             <QuantumCore 
                                charge={coreCharge} 
                                isDischarging={isCoreDischarging}
                                onInteraction={handleCoreInteraction}
                                multiplier={coreBonuses.multiplier}
                                size={96}
                                showReadyNotification={showCoreReadyNotification}
                             />
                            {!gameState.chosenQuantumPath && !gameState.hasInteractedWithQuantumCore && (
                                <div className="absolute z-10 w-48 pointer-events-none
                                                top-full mt-2 left-1/2 -translate-x-1/2 
                                                md:left-full md:ml-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0
                                                animate-fade-in-fast">
                                    <div className="flex items-center gap-2">
                                        <AIAvatar className="w-12 h-12 animate-ai-bob" />
                                        <div className="bg-[var(--bg-popup)] p-2 rounded-lg border border-cyan-500/50 text-xs shadow-lg relative
                                                        before:content-[''] before:absolute before:w-0 before:h-0
                                                        before:bottom-full before:left-1/2 before:-translate-x-1/2
                                                        before:border-l-8 before:border-l-transparent
                                                        before:border-r-8 before:border-r-transparent
                                                        before:border-b-8 before:border-b-[var(--bg-popup)]
                                                        
                                                        md:before:bottom-auto md:before:left-auto
                                                        md:before:top-1/2 md:before:-translate-y-1/2 md:before:-left-2
                                                        md:before:border-l-0 md:before:border-r-8 md:before:border-b-transparent
                                                        md:before:border-r-[var(--bg-popup)]
                                                        md:before:border-t-8 md:before:border-t-transparent
                                                        md:before:border-b-8">
                                            <p>Tiens, c'est nouveau. Qu'est-ce qu'il se passe si nous cliquons dessus ?</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div id="stats-display-container" className="grid grid-cols-2 gap-2">
                        <div id="stat-prod">
                            <StatDisplay 
                                label="Prod/sec" 
                                value={memoizedFormatNumber(productionTotal)} 
                                icon="⚡" 
                                colorClass="text-yellow-300" 
                                showRepaymentIndicator={!!currentLoan}
                            />
                        </div>
                        <div id="stat-click">
                            <StatDisplay label="Clic" value={memoizedFormatNumber(clickPower)} icon="🖱️" colorClass="text-cyan-300" />
                        </div>
                        {showEPSMeter && (
                            <div id="stat-avg-prod">
                                <StatDisplay 
                                    label="Prod. Moy (10s)" 
                                    value={memoizedFormatNumber(avgProductionLast10s)} 
                                    icon="📈" 
                                    colorClass="text-green-300" 
                                />
                            </div>
                        )}
                         {/* FIX: Replaced `isDischarging` with `isCoreDischarging` to resolve a reference error. */}
                         {isCoreUnlocked && !isCoreDischarging && coreCharge < 100 && (
                            <div id="stat-core-charge-time">
                                <StatDisplay 
                                    label="Temps de Charge" 
                                    value={formatDuration(timeToFullSeconds)} 
                                    icon="⏱️" 
                                    colorClass="text-purple-300" 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    id="collect-button"
                    onMouseDown={onCollect}
                    onTouchStart={onCollect}
                    className={`w-48 h-16 text-xl rounded-md bg-red-600 hover:bg-red-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 flex justify-center items-center mx-auto`}
                >
                    Collecter
                </button>
            </div>
        </section>
    );
};

export default CoreSection;