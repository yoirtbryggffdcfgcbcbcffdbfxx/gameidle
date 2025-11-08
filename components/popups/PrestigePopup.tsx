// FIX: This file was created to resolve module not found errors.
import React from 'react';
import Popup from './Popup';
import { PRESTIGE_UPGRADES } from '../../constants';
import { MAX_ENERGY } from '../../constants';

interface PrestigePopupProps {
    canPrestige: boolean;
    prestigeCount: number;
    prestigeGain: number;
    purchasedPrestigeUpgrades: string[];
    onPrestige: () => void;
    onBuyPrestigeUpgrade: (id: string) => void;
    onClose: () => void;
    formatNumber: (num: number) => string;
    energy: number;
    totalUpgradesOwned: number;
}

const PrestigePopup: React.FC<PrestigePopupProps> = ({
    canPrestige,
    prestigeCount,
    prestigeGain,
    purchasedPrestigeUpgrades,
    onPrestige,
    onBuyPrestigeUpgrade,
    onClose,
    formatNumber,
    energy,
    totalUpgradesOwned
}) => {
    return (
        <Popup title="Prestige" onClose={onClose}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[var(--bg-main)] p-3 rounded-lg text-center">
                    <p className="text-lg">Vous avez <strong className="text-yellow-400">{prestigeCount}</strong> points de prestige.</p>
                    <p className="text-sm opacity-80">Ces points offrent des bonus permanents.</p>
                </div>

                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg">
                    <h3 className="text-lg text-[var(--text-bright)] mb-2">Faire un Prestige</h3>
                    <p className="mb-1">Condition 1: Atteindre {formatNumber(MAX_ENERGY)} énergie ({energy >= MAX_ENERGY ? '✔️' : '❌'})</p>
                    <p className="mb-3">Condition 2: Posséder au moins 10 améliorations ({totalUpgradesOwned >= 10 ? '✔️' : '❌'})</p>
                    
                    {canPrestige && <p className="text-green-400">Vous gagnerez {prestigeGain} points de prestige.</p>}
                    
                    <button 
                        onClick={onPrestige} 
                        disabled={!canPrestige}
                        className="w-full mt-2 p-2 rounded-md bg-purple-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-purple-600"
                    >
                        {canPrestige ? 'Prestige Maintenant' : 'Conditions non remplies'}
                    </button>
                    <p className="text-xs opacity-70 mt-2">Le prestige réinitialisera votre énergie et vos améliorations, mais vous conserverez vos points de prestige et leurs améliorations.</p>
                </div>

                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg">
                     <h3 className="text-lg text-[var(--text-bright)] mb-2">Améliorations de Prestige</h3>
                     <div className="space-y-2">
                        {PRESTIGE_UPGRADES.map(upgrade => {
                            const isPurchased = purchasedPrestigeUpgrades.includes(upgrade.id);
                            const canAfford = prestigeCount >= upgrade.cost;
                            return (
                                <div key={upgrade.id} className={`p-2 rounded flex justify-between items-center ${isPurchased ? 'bg-green-800/50' : 'bg-black/20'}`}>
                                    <div>
                                        <strong>{upgrade.name}</strong>
                                        <p className="text-xs opacity-80">{upgrade.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onBuyPrestigeUpgrade(upgrade.id)}
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

export default PrestigePopup;
