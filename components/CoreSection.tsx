import React from 'react';
import Logo from './Logo';
import { useGameContext } from '../contexts/GameContext';
import QuantumCore from './QuantumCore';
import EnergyBar from './core/EnergyBar';
import StatsGrid from './core/StatsGrid';
import CoreTutorialTooltip from './core/CoreTutorialTooltip';
import FeatherIcon from './ui/FeatherIcon';
import ClockIcon from './ui/ClockIcon';
import { formatDuration } from '../utils/helpers';

const CoreSection: React.FC = () => {
    const { gameState, computedState, handlers, popups } = useGameContext();
    const { coreCharge, isCoreDischarging, coreDischargeEndTimestamp, activeGift, upgrades } = gameState;
    const { coreBonuses, timeToFullSeconds } = computedState;
    const { onCollect, onDischargeCore, enterQuantumInterface } = handlers;
    const { setShowGiftPopup } = popups;
    
    const handleCoreInteraction = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (coreCharge >= 100) {
            onDischargeCore(e);
        } else {
            enterQuantumInterface(e);
        }
    };

    const showCoreReadyNotification = coreCharge >= 100 && !isCoreDischarging;
    
    // Show feather if gift booster is owned
    const giftUpgrade = upgrades.find(u => u.id === 'boost_gift_1');
    const showGiftButton = giftUpgrade && giftUpgrade.owned > 0;

    return (
        <section id="core" className="fullscreen-section reveal relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-[#0a0a1a] to-black">
            {/* 3D Perspective Background */}
            <div className="perspective-grid opacity-40"></div>
            
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

            {/* Main Container: Split into Reactor View (Top) and Control Deck (Bottom) */}
            <div className="relative z-10 w-full max-w-xl h-full flex flex-col justify-between pb-4 md:pb-8">
                
                {/* TOP: Reactor View (Stats & Visuals) */}
                <div className="flex flex-col items-center justify-center flex-grow min-h-0 relative py-4">
                    
                    {/* Floating Logo */}
                    <div className="mb-2 scale-90 opacity-90">
                        <Logo isAnimated={gameState.isCoreUnlocked} />
                    </div>

                    {/* The Core Itself */}
                    {gameState.isCoreUnlocked ? (
                        <div className="relative my-2 flex flex-col items-center">
                            <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse-slow pointer-events-none"></div>
                            <div className="relative z-10">
                                <QuantumCore 
                                    charge={coreCharge} 
                                    isDischarging={isCoreDischarging}
                                    dischargeEndTimestamp={coreDischargeEndTimestamp}
                                    onInteraction={handleCoreInteraction}
                                    multiplier={coreBonuses.multiplier}
                                    size={130}
                                    showReadyNotification={showCoreReadyNotification}
                                />
                                <CoreTutorialTooltip />
                            </div>

                            {/* TIMER DE RECHARGE - Placé juste sous le cœur */}
                            {!isCoreDischarging && coreCharge < 100 && (
                                <div className="mt-3 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-purple-500/30 backdrop-blur-sm animate-fade-in">
                                    <ClockIcon className="w-3 h-3 text-purple-400" />
                                    <span className="text-xs font-mono text-purple-200">
                                        Recharge: <span className="text-white font-bold">{formatDuration(timeToFullSeconds)}</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-32 w-32 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 font-mono text-xs bg-black/40 backdrop-blur-sm mb-8">
                            OFFLINE
                        </div>
                    )}

                    {/* Holographic Stats HUD */}
                    <div className="w-full max-w-sm mt-auto mb-4 px-4">
                        <StatsGrid />
                    </div>
                </div>

                {/* BOTTOM: Control Deck */}
                <div className="w-full space-y-4 px-4 pt-4 border-t border-white/5 bg-gradient-to-t from-black/80 to-transparent">
                    {/* Plasma Energy Bar */}
                    <div className="w-full">
                        <EnergyBar />
                    </div>

                    {/* The Injector (Collect Button) */}
                    <button
                        id="collect-button"
                        onPointerDown={onCollect}
                        className="injector-button group"
                    >
                        <div className="injector-core">
                            <span className="injector-label">INJECTION</span>
                        </div>
                        
                        {/* Decorative elements on the button */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_5px_white]"></div>
                    </button>
                </div>
            </div>
            
            {/* Gift Trigger (Floating) */}
            {showGiftButton && (
                <button 
                    onClick={() => setShowGiftPopup(true)}
                    className={`absolute top-24 left-4 p-3 rounded-full border transition-all duration-300 z-30 group
                        ${activeGift 
                            ? 'bg-cyan-900/80 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-110 animate-pulse' 
                            : 'bg-black/40 border-white/10 text-gray-600 hover:border-white/30'
                        }
                    `}
                >
                    <FeatherIcon className="w-6 h-6" />
                    {activeGift && (
                         <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-bounce"></span>
                    )}
                </button>
            )}
        </section>
    );
};

export default CoreSection;