import React from 'react';
import Logo from './Logo';
import { useGameContext } from '../contexts/GameContext';
import QuantumCore from './QuantumCore';
import EnergyBar from './core/EnergyBar';
import StatsGrid from './core/StatsGrid';
import CoreTutorialTooltip from './core/CoreTutorialTooltip';


const CoreSection: React.FC = () => {
    const { gameState, computedState, handlers } = useGameContext();
    const { coreCharge, isCoreDischarging, coreDischargeEndTimestamp } = gameState;
    const { coreBonuses } = computedState;
    const { onCollect, onDischargeCore, enterQuantumInterface } = handlers;
    
    const handleCoreInteraction = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (coreCharge >= 100) {
            onDischargeCore(e);
        } else {
            enterQuantumInterface(e);
        }
    };

    const showCoreReadyNotification = coreCharge >= 100 && !isCoreDischarging;

    return (
        <section id="core" className="fullscreen-section reveal">
            <div className="text-center flex flex-col items-center justify-between h-full py-8 w-full max-w-lg">
                <Logo isAnimated={gameState.isCoreUnlocked} />
                <div className="w-full space-y-3">
                    <EnergyBar />
                    
                    {gameState.isCoreUnlocked && (
                        <div className="my-2 relative w-min mx-auto">
                             <QuantumCore 
                                charge={coreCharge} 
                                isDischarging={isCoreDischarging}
                                dischargeEndTimestamp={coreDischargeEndTimestamp}
                                onInteraction={handleCoreInteraction}
                                multiplier={coreBonuses.multiplier}
                                size={96}
                                showReadyNotification={showCoreReadyNotification}
                             />
                            <CoreTutorialTooltip />
                        </div>
                    )}

                    <StatsGrid />
                </div>

                <button
                    id="collect-button"
                    onPointerDown={onCollect}
                    className="collect-button mx-auto"
                >
                    <span className="collect-button-content">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <polygon strokeLinecap="round" strokeLinejoin="round" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        Collecter
                    </span>
                    <span className="scan-line"></span>
                </button>
            </div>
        </section>
    );
};

export default CoreSection;