// FIX: This file was created to resolve module not found errors.
import React from 'react';
import Popup from './Popup';
import { ASCENSION_UPGRADES } from '../../constants';
import { Upgrade } from '../../types';

interface AscensionPopupProps {
    canAscend: boolean;
    ascensionCount: number;
    ascensionGain: number;
    purchasedAscensionUpgrades: string[];
    onAscend: () => void;
    onBuyAscensionUpgrade: (id: string) => void;
    onClose: () => void;
    energy: number;
    maxEnergy: number;
    formatNumber: (n: number) => string;
}

const AscensionPopup: React.FC<AscensionPopupProps> = ({
    canAscend,
    ascensionCount,
    ascensionGain,
    purchasedAscensionUpgrades,
    onAscend,
    onBuyAscensionUpgrade,
    onClose,
    energy,
    maxEnergy,
    formatNumber,
}) => {
    return (
        <Popup title="Ascension" onClose={onClose}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[var(--bg-main)] p-3 rounded-lg text-center">
                    <p className="text-lg">Vous avez <strong className="text-yellow-400">{ascensionCount}</strong> points d'ascension.</p>
                    <p className="text-sm opacity-80">Ces points offrent des bonus permanents.</p>
                </div>

                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg">
                    <h3 className="text-lg text-[var(--text-bright)] mb-2">Faire une Ascension</h3>
                    <p className="mb-3 text-xs">
                        Condition: Atteindre la capacité d'énergie maximale.
                        <br/>
                        <span className={`mt-1 inline-block ${canAscend ? 'text-green-400' : 'text-red-400'}`}>
                           ({formatNumber(energy)} / {formatNumber(maxEnergy)})
                        </span>
                    </p>
                    
                    {canAscend && <p className="text-green-400">Vous gagnerez {ascensionGain} point d'ascension et {ascensionGain} Fragment Quantique.</p>}
                    
                    <button 
                        onClick={onAscend} 
                        disabled={!canAscend}
                        className="w-full mt-2 p-2 rounded-md bg-purple-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-purple-600"
                    >
                        {canAscend ? 'Faire une Ascension' : 'Conditions non remplies'}
                    </button>
                    <p className="text-xs opacity-70 mt-2">L'ascension réinitialisera votre énergie et vos améliorations, mais vous conserverez vos points d'ascension et leurs améliorations.</p>
                </div>

                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg">
                     <h3 className="text-lg text-[var(--text-bright)] mb-2">Améliorations d'Ascension</h3>
                     <div className="space-y-2">
                        {ASCENSION_UPGRADES.map(upgrade => {
                            const isPurchased = purchasedAscensionUpgrades.includes(upgrade.id);
                            const canAfford = ascensionCount >= upgrade.cost;
                            return (
                                <div key={upgrade.id} className={`p-2 rounded flex justify-between items-center ${isPurchased ? 'bg-green-800/50' : 'bg-black/20'}`}>
                                    <div>
                                        <strong>{upgrade.name}</strong>
                                        <p className="text-xs opacity-80">{upgrade.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onBuyAscensionUpgrade(upgrade.id)}
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
        </Popup>
    );
};

export default AscensionPopup;