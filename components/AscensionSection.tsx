
import React, { useRef, useEffect } from 'react';
import SkillTree from './ui/SkillTree';
import { ASCENSION_UPGRADES } from '../data/ascension';
import { useGameContext } from '../contexts/GameContext';
import SectionHeader from './ui/SectionHeader';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';

const AscensionSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    const { energy, ascensionPoints, ascensionLevel, purchasedAscensionUpgrades } = gameState;
    const { canAscend, ascensionGain, maxEnergy, unlockedUpgradesAtMaxLevelCount, unlockedUpgradesForCurrentAscensionCount } = computedState;
    const { onAscend, onBuyAscensionUpgrade } = handlers;
    
    const isFirstAscension = ascensionLevel === 0;
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
        <section id="ascension-portal" className="fullscreen-section reveal">
             {/* UNIFIED GLASS PANEL STYLE */}
            <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a12]/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <SectionHeader title="Portail d'Ascension" energy={energy} formatNumber={memoizedFormatNumber} />
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col justify-between md:col-span-1 border border-white/5">
                        <div>
                            <h3 className="text-lg text-yellow-400 mb-2">Faire une Ascension</h3>
                            <div className="mb-3 text-xs space-y-2">
                                <p>
                                    Condition: Atteindre la capacité d'énergie maximale.
                                    <br/>
                                    <span className={`mt-1 inline-block ${energy >= maxEnergy ? 'text-green-400' : 'text-red-400'}`}>
                                       ({memoizedFormatNumber(energy)} / {memoizedFormatNumber(maxEnergy)})
                                    </span>
                                </p>
                                {isFirstAscension && (
                                    <p>
                                        Condition (1ère Ascension): Maximiser toutes les améliorations.
                                        <br />
                                        <span className={`mt-1 inline-block ${unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscensionCount ? 'text-green-400' : 'text-red-400'}`}>
                                            ({unlockedUpgradesAtMaxLevelCount} / {unlockedUpgradesForCurrentAscensionCount} améliorations maxées)
                                        </span>
                                    </p>
                                )}
                            </div>
                            {canAscend && <p className="text-green-400 text-sm my-2">Vous gagnerez {ascensionGain} point d'ascension et {ascensionGain} Fragment Quantique.</p>}
                            <p className="text-xs opacity-70 mt-2">L'ascension réinitialise votre énergie et vos améliorations, mais vous conserverez vos points et fragments d'ascension et leurs améliorations.</p>
                        </div>
                        <button 
                            onClick={onAscend} 
                            disabled={!canAscend}
                            className="w-full mt-4 p-3 rounded-md bg-purple-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-purple-600 text-lg"
                        >
                            {canAscend ? 'Faire une Ascension' : 'Conditions non remplies'}
                        </button>
                    </div>

                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col md:col-span-2 border border-white/5">
                         <h3 className="text-lg text-yellow-400 mb-2">Arbre d'Ascension</h3>
                         <p className="text-sm mb-2">Vous avez <strong className="text-yellow-400">{ascensionPoints}</strong> points.</p>
                         <div ref={scrollableTreeRef} className="flex-grow overflow-auto custom-scrollbar pr-1 relative scroll-contain">
                            <SkillTree
                                upgrades={ASCENSION_UPGRADES}
                                purchasedIds={purchasedAscensionUpgrades}
                                onBuy={onBuyAscensionUpgrade}
                                currency={ascensionPoints}
                                currencyType="Points"
                                themeColor="yellow"
                            />
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AscensionSection;
