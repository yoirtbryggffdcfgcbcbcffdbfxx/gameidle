import React from 'react';
import { ASCENSION_UPGRADES } from '../constants';

interface AscensionSectionProps {
    canAscend: boolean;
    ascensionPoints: number;
    ascensionLevel: number;
    ascensionGain: number;
    purchasedAscensionUpgrades: string[];
    onAscend: () => void;
    onBuyAscensionUpgrade: (id: string) => void;
    energy: number;
    maxEnergy: number;
    formatNumber: (n: number) => string;
    unlockedUpgradesAtMaxLevelCount: number;
    unlockedUpgradesForCurrentAscensionCount: number;
}

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);


const AscensionSection: React.FC<AscensionSectionProps> = (props) => {
    const isFirstAscension = props.ascensionLevel === 0;

    return (
        <section id="ascension-portal" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                <SectionHeader title="Portail d'Ascension" energy={props.energy} formatNumber={props.formatNumber} />
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg text-yellow-400 mb-2">Faire une Ascension</h3>
                            <div className="mb-3 text-xs space-y-2">
                                <p>
                                    Condition: Atteindre la capacité d'énergie maximale.
                                    <br/>
                                    <span className={`mt-1 inline-block ${props.energy >= props.maxEnergy ? 'text-green-400' : 'text-red-400'}`}>
                                       ({props.formatNumber(props.energy)} / {props.formatNumber(props.maxEnergy)})
                                    </span>
                                </p>
                                {isFirstAscension && (
                                    <p>
                                        Condition (1ère Ascension): Maximiser toutes les améliorations.
                                        <br />
                                        <span className={`mt-1 inline-block ${props.unlockedUpgradesAtMaxLevelCount === props.unlockedUpgradesForCurrentAscensionCount ? 'text-green-400' : 'text-red-400'}`}>
                                            ({props.unlockedUpgradesAtMaxLevelCount} / {props.unlockedUpgradesForCurrentAscensionCount} améliorations maxées)
                                        </span>
                                    </p>
                                )}
                            </div>
                            {props.canAscend && <p className="text-green-400 text-sm my-2">Vous gagnerez {props.ascensionGain} point d'ascension et {props.ascensionGain} Fragment Quantique.</p>}
                            <p className="text-xs opacity-70 mt-2">L'ascension réinitialise votre énergie et vos améliorations, mais vous conserverez vos points et fragments d'ascension et leurs améliorations.</p>
                        </div>
                        <button 
                            onClick={props.onAscend} 
                            disabled={!props.canAscend}
                            className="w-full mt-4 p-3 rounded-md bg-purple-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-purple-600 text-lg"
                        >
                            {props.canAscend ? 'Faire une Ascension' : 'Conditions non remplies'}
                        </button>
                    </div>

                    <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col">
                         <h3 className="text-lg text-yellow-400 mb-2">Améliorations d'Ascension</h3>
                         <p className="text-sm mb-2">Vous avez <strong className="text-yellow-400">{props.ascensionPoints}</strong> points.</p>
                         <div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-1">
                            {ASCENSION_UPGRADES.map(upgrade => {
                                const isPurchased = props.purchasedAscensionUpgrades.includes(upgrade.id);
                                const canAfford = props.ascensionPoints >= upgrade.cost;
                                return (
                                    <div key={upgrade.id} className={`p-2 rounded flex justify-between items-center ${isPurchased ? 'bg-green-800/50' : 'bg-black/20'}`}>
                                        <div>
                                            <strong>{upgrade.name}</strong>
                                            <p className="text-xs opacity-80">{upgrade.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => props.onBuyAscensionUpgrade(upgrade.id)}
                                            disabled={isPurchased || !canAfford}
                                            className="text-sm px-3 py-1 rounded bg-yellow-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:enabled:bg-yellow-500"
                                        >
                                            {isPurchased ? 'Acheté' : `Coût: ${upgrade.cost}`}
                                        </button>
                                    </div>
                                );
                            })}
                         </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AscensionSection;