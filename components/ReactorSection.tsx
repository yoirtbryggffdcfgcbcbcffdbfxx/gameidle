import React, { useRef } from 'react';
import { CORE_UPGRADES } from '../data/core';
import SkillTree from './ui/SkillTree';
import { useGameContext } from '../contexts/GameContext';
import SectionHeader from './ui/SectionHeader';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';

const ReactorSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    const { quantumShards, purchasedCoreUpgrades, energy } = gameState;
    const { onBuyCoreUpgrade } = handlers;
    const scrollableTreeRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableTreeRef);
    
    return (
        <section id="reactor" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                 <SectionHeader title="Réacteur Quantique" energy={energy} formatNumber={memoizedFormatNumber} />
                <div className="flex-grow overflow-hidden custom-scrollbar pr-2">
                    
                    <div className="w-full h-full bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col">
                         <h3 className="text-lg text-center text-cyan-400 mb-2">Arbre de Calibration du Cœur</h3>
                         <p className="text-sm text-center mb-2">Vous avez <strong className="text-purple-400">{quantumShards}</strong> Fragments Quantiques.</p>
                         <div ref={scrollableTreeRef} className="flex-grow overflow-auto custom-scrollbar pr-1 relative min-h-[300px] scroll-contain">
                            <SkillTree 
                                upgrades={CORE_UPGRADES}
                                purchasedIds={purchasedCoreUpgrades}
                                onBuy={onBuyCoreUpgrade}
                                currency={quantumShards}
                                currencyType="FQ"
                                themeColor="purple"
                            />
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReactorSection;