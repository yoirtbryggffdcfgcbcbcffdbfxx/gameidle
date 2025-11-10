import React from 'react';
import SkillTree from './ui/SkillTree';
import { ASCENSION_UPGRADES } from '../constants';
import { useGameContext } from '../contexts/GameContext';

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);


const AscensionSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber } = useGameContext();
    const { energy, ascensionPoints, ascensionLevel, purchasedAscensionUpgrades } = gameState;
    const { canAscend, ascensionGain, maxEnergy, unlockedUpgradesAtMaxLevelCount, unlockedUpgradesForCurrentAscensionCount } = computedState;
    const { onAscend, onBuyAscensionUpgrade } = handlers;
    
    const isFirstAscension = ascensionLevel === 0;

    return (
        <section id="ascension-portal" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                <SectionHeader title="Portail d'Ascension" energy={energy} formatNumber={memoizedFormatNumber} />
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col justify-between md:col-span-1">
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

                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col md:col-span-2">
                         <h3 className="text-lg text-yellow-400 mb-2">Arbre d'Ascension</h3>
                         <p className="text-sm mb-2">Vous avez <strong className="text-yellow-400">{ascensionPoints}</strong> points.</p>
                         <div className="flex-grow overflow-auto custom-scrollbar pr-1 relative">
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