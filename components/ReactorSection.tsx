
import React, { useRef, useEffect } from 'react';
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

    // Lock main page scroll when interacting with the skill tree to prevent scroll bleed
    useEffect(() => {
        const scrollEl = scrollableTreeRef.current;
        const gameContentEl = document.getElementById('game-content');
        if (!scrollEl || !gameContentEl) return;

        const lockScroll = () => { gameContentEl.style.overflowY = 'hidden'; };
        const unlockScroll = () => { gameContentEl.style.overflowY = 'auto'; };

        scrollEl.addEventListener('mouseenter', lockScroll);
        scrollEl.addEventListener('mouseleave', unlockScroll);
        scrollEl.addEventListener('touchstart', lockScroll, { passive: true });
        scrollEl.addEventListener('touchend', unlockScroll);
        scrollEl.addEventListener('touchcancel', unlockScroll);

        return () => {
            scrollEl.removeEventListener('mouseenter', lockScroll);
            scrollEl.removeEventListener('mouseleave', unlockScroll);
            scrollEl.removeEventListener('touchstart', lockScroll);
            scrollEl.removeEventListener('touchend', unlockScroll);
            scrollEl.removeEventListener('touchcancel', unlockScroll);
            unlockScroll();
        };
    }, []);
    
    return (
        <section id="reactor" className="fullscreen-section reveal">
            {/* UNIFIED GLASS PANEL STYLE */}
            <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a12]/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <SectionHeader title="Réacteur Quantique" energy={energy} formatNumber={memoizedFormatNumber} />
                <div className="flex-grow overflow-hidden custom-scrollbar pr-2">
                    
                    <div className="w-full h-full bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col border border-white/5">
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
