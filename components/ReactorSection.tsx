import React from 'react';
import { CORE_UPGRADES } from '../data/core';
import QuantumCore from './QuantumCore';
import SkillTree from './ui/SkillTree';
import { useGameContext } from '../contexts/GameContext';
import SectionHeader from './ui/SectionHeader';

const ReactorSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    // FIX: Get `coreBonuses` from computed state, not game state.
    const { quantumShards, purchasedCoreUpgrades, coreCharge, isCoreDischarging, energy } = gameState;
    const { coreBonuses } = computedState;
    const { onBuyCoreUpgrade, onDischargeCore } = handlers;
    
    return (
        <section id="reactor" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                 <SectionHeader title="Réacteur Quantique" energy={energy} formatNumber={memoizedFormatNumber} />
                <div className="flex-grow overflow-hidden custom-scrollbar pr-2">
                    
                    <div className="w-full h-full bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col">
                         <h3 className="text-lg text-center text-cyan-400 mb-2">Arbre de Calibration du Cœur</h3>
                         <p className="text-sm text-center mb-2">Vous avez <strong className="text-purple-400">{quantumShards}</strong> Fragments Quantiques.</p>
                         <div className="flex-grow overflow-auto custom-scrollbar pr-1 relative min-h-[300px]">
                            <SkillTree 
                                upgrades={CORE_UPGRADES}
                                purchasedIds={purchasedCoreUpgrades}
                                onBuy={onBuyCoreUpgrade}
                                currency={quantumShards}
                                currencyType="FQ"
                                themeColor="purple"
                            >
                                 <QuantumCore
                                    charge={coreCharge}
                                    isDischarging={isCoreDischarging}
                                    onDischarge={onDischargeCore}
                                    multiplier={coreBonuses.multiplier}
                                    size={160}
                                />
                            </SkillTree>
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReactorSection;