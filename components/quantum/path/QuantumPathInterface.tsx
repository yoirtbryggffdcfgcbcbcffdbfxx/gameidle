import React, { useRef } from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import { useDragToScroll } from '../../../hooks/ui/useDragToScroll';
import QuantumCore from '../../QuantumCore';
import { QUANTUM_PATHS } from '../../../data/quantumPaths';
import QuantumPathUpgradeCard from './QuantumPathUpgradeCard';
import { formatDuration } from '../../../utils/helpers';

const QuantumBackground: React.FC = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#020024] via-[#090979] to-[#000d14] z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </div>
);

const QuantumPathInterface: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    const { chosenQuantumPath, quantumPathLevel, quantumShards, coreCharge, isCoreDischarging } = gameState;
    const { coreBonuses, timeToFullSeconds } = computedState;
    const { exitQuantumInterface, onPurchasePathUpgrade } = handlers;
    
    const scrollableRef = useRef<HTMLElement>(null);
    useDragToScroll(scrollableRef);

    if (!chosenQuantumPath) {
        // This should ideally not happen if logic is correct, but it's a safe fallback.
        return (
            <div className="fixed inset-0 bg-black flex flex-col justify-center items-center text-white">
                <p>Aucune voie n'a été choisie.</p>
                <button onClick={exitQuantumInterface} className="mt-4 p-2 bg-red-500 rounded">Retour</button>
            </div>
        );
    }

    const pathData = QUANTUM_PATHS[chosenQuantumPath];
    const nextUpgrade = pathData.upgrades.find(u => u.level === quantumPathLevel + 1);
    // FIX: Add logic for showing core ready notification.
    const showCoreReadyNotification = coreCharge >= 100 && !isCoreDischarging;

    return (
        <div className="fixed inset-0 text-white flex flex-col">
            <QuantumBackground />

            {/* Header */}
            <header className="flex-shrink-0 p-4 text-center z-10 bg-black/30">
                <h1 className="text-2xl sm:text-3xl text-cyan-300" style={{ textShadow: '0 0 8px #00ffff' }}>
                    Voie du {pathData.name}
                </h1>
                <p className="text-sm opacity-80">Améliorez votre voie avec des Fragments Quantiques.</p>
            </header>

            {/* Scrollable Content */}
            <main ref={scrollableRef} className="flex-grow overflow-y-auto custom-scrollbar p-4 pb-24 scroll-contain">
                <div className="w-full max-w-2xl lg:max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8">
                    
                    {/* Left Panel - Core Status */}
                    <div className="w-full md:w-1/3 flex flex-col items-center p-4 bg-black/20 rounded-lg">
                        <QuantumCore
                            charge={coreCharge}
                            isDischarging={isCoreDischarging}
                            onInteraction={() => {}}
                            multiplier={coreBonuses.multiplier}
                            size={128}
                            showReadyNotification={showCoreReadyNotification}
                        />
                        <div className="text-center mt-4 space-y-1 text-xs">
                            <p>Niveau: <strong className="text-yellow-400">{quantumPathLevel} / {pathData.upgrades.length}</strong></p>
                            <p>Vitesse: <strong className="text-cyan-400">x{coreBonuses.chargeRate.toFixed(2)}</strong></p>
                            <p>Boost: <strong className="text-purple-400">x{coreBonuses.multiplier.toFixed(2)}</strong></p>
                             {/* FIX: Replaced `isDischarging` with `isCoreDischarging` to resolve a reference error. */}
                             {!isCoreDischarging && coreCharge < 100 && (
                                <p>Temps de Charge: <strong className="text-purple-300">{formatDuration(timeToFullSeconds)}</strong></p>
                            )}
                             <p className="pt-2">Fragments: <strong className="text-purple-300">{memoizedFormatNumber(quantumShards)} FQ</strong></p>
                        </div>
                    </div>
                    
                    {/* Right Panel - Upgrade Path */}
                    <div className="w-full md:w-2/3 space-y-3">
                        {pathData.upgrades.map(upgrade => (
                            <QuantumPathUpgradeCard
                                key={upgrade.level}
                                upgrade={upgrade}
                                currentLevel={quantumPathLevel}
                                quantumShards={quantumShards}
                                onPurchase={onPurchasePathUpgrade}
                            />
                        ))}
                         {quantumPathLevel >= pathData.upgrades.length && (
                            <div className="text-center p-4 bg-black/30 rounded-lg">
                                <p className="text-yellow-400 font-bold">🏆 Voie Maîtrisée !</p>
                                <p className="text-xs opacity-80 mt-1">Vous avez atteint le plein potentiel de cette voie.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center p-4 z-10">
                <button 
                    onClick={exitQuantumInterface} 
                    className="w-full max-w-xs px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border-2 border-cyan-400 rounded-lg transition-colors text-lg text-cyan-300 shadow-lg shadow-cyan-500/20"
                    style={{ textShadow: '0 0 8px #00ffff' }}
                >
                    Retour au Jeu
                </button>
            </footer>
        </div>
    );
};

export default QuantumPathInterface;
