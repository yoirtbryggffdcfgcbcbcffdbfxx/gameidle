import React, { useRef } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import QuantumCore from '../QuantumCore';
import UpgradeChoiceCard from '../quantum/UpgradeChoiceCard';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import { QUANTUM_PATHS } from '../../data/quantumPaths';
import { QuantumPathType } from '../../types';

const QuantumBackground: React.FC = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#020024] via-[#090979] to-[#000d14] z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </div>
);

// New Stat Component for better visual separation
const StatPill: React.FC<{ label: string; value: string | number; icon: string; }> = ({ label, value, icon }) => (
    <div className="bg-black/40 rounded-full px-4 py-2 flex items-center gap-2 text-center">
        <span className="text-lg">{icon}</span>
        <div>
            <div className="text-xs opacity-70">{label}</div>
            <div className="text-sm font-bold">{value}</div>
        </div>
    </div>
);

const QuantumCoreView: React.FC = () => {
    const { gameState, computedState, handlers } = useGameContext();
    const { coreCharge, isCoreDischarging, quantumPathLevel, coreDischargeEndTimestamp } = gameState;
    const { coreBonuses } = computedState;
    const { exitQuantumInterface, onChooseQuantumPath } = handlers;
    
    const scrollableRef = useRef<HTMLElement>(null);
    useDragToScroll(scrollableRef);

    const showCoreReadyNotification = coreCharge >= 100 && !isCoreDischarging;

    const pathChoices: { type: QuantumPathType; data: typeof QUANTUM_PATHS[QuantumPathType] }[] = [
        { type: 'RATE', data: QUANTUM_PATHS.RATE },
        { type: 'MULTIPLIER', data: QUANTUM_PATHS.MULTIPLIER },
        { type: 'BALANCED', data: QUANTUM_PATHS.BALANCED },
    ];

    return (
        <div className="fixed inset-0 text-white flex flex-col">
            <QuantumBackground />

            {/* Scrollable Content Area */}
            <main ref={scrollableRef} className="flex-grow overflow-y-auto custom-scrollbar p-4 pt-8 pb-24 scroll-contain">
                <div className="w-full max-w-lg md:max-w-5xl mx-auto flex flex-col items-center space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-4xl text-cyan-300" style={{ textShadow: '0 0 8px #00ffff' }}>
                            Spécialisation du Cœur
                        </h1>
                        <p className="opacity-80 text-sm mt-1">Choisissez une voie de développement permanente.</p>
                    </div>

                    {/* Core and Stats */}
                    <div className="w-full flex flex-col items-center gap-4">
                        <QuantumCore
                            charge={coreCharge}
                            isDischarging={isCoreDischarging}
                            dischargeEndTimestamp={coreDischargeEndTimestamp}
                            onInteraction={() => {}} // Click is disabled in this view
                            multiplier={coreBonuses.multiplier}
                            size={160}
                            showReadyNotification={showCoreReadyNotification}
                        />
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                           <StatPill label="Niveau" value={quantumPathLevel} icon="📈" />
                           <StatPill label="Vitesse" value={`x${(coreBonuses.chargeRate).toFixed(2)}`} icon="⏩" />
                           <StatPill label="Boost" value={`x${(coreBonuses.multiplier).toFixed(2)}`} icon="💥" />
                        </div>
                    </div>

                    {/* Path Choices */}
                    <div className="w-full pt-4">
                        <h2 className="text-xl sm:text-2xl text-center mb-4">Choisissez une voie</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:items-start">
                            {pathChoices.map(({ type, data }) => (
                                <UpgradeChoiceCard 
                                    key={type}
                                    type={type}
                                    pathData={data}
                                    onChoose={() => onChooseQuantumPath(type)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Footer for Back Button */}
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

export default QuantumCoreView;