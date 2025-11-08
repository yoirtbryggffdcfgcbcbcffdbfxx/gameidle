import React from 'react';
import Popup from './Popup';
import { MAX_ENERGY, PRESTIGE_UPGRADES } from '../../constants';

interface PrestigePopupProps {
    canPrestige: boolean;
    prestigeCount: number;
    prestigeGain: number;
    purchasedPrestigeUpgrades: string[];
    onPrestige: () => void;
    onBuyPrestigeUpgrade: (id: string) => void;
    onClose: () => void;
    formatNumber: (num: number) => string;
}

const PrestigePopup: React.FC<PrestigePopupProps> = ({ canPrestige, prestigeCount, prestigeGain, purchasedPrestigeUpgrades, onPrestige, onBuyPrestigeUpgrade, onClose, formatNumber }) => {
    return (
        <Popup title="Prestige" onClose={onClose}>
            <div className="text-center mb-4">
                <p>Vous avez <strong className="text-purple-400 text-lg">{prestigeCount}</strong> points de prestige.</p>
                <button 
                    onClick={onPrestige} 
                    disabled={!canPrestige} 
                    className="w-full bg-green-600 text-white p-2 rounded mt-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Faire Prestige (+{prestigeGain} {prestigeGain > 1 ? 'points' : 'point'})
                </button>
                {!canPrestige && (
                    <div className="text-xs mt-1 opacity-80">
                        (Nécessite {formatNumber(MAX_ENERGY)} énergie et 10 améliorations)
                    </div>
                )}
            </div>

            <hr className="border-gray-600 my-2" />

            <h4 className="text-md text-[var(--text-header)] mb-2">Améliorations Permanentes</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {PRESTIGE_UPGRADES.map(upgrade => {
                    const isPurchased = purchasedPrestigeUpgrades.includes(upgrade.id);
                    const canAfford = prestigeCount >= upgrade.cost;
                    return (
                        <div key={upgrade.id} className={`p-2 rounded ${isPurchased ? 'bg-green-800/50' : 'bg-gray-700/50'}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <strong className="text-sm">{upgrade.name}</strong>
                                    <p className="text-xs opacity-70">{upgrade.description}</p>
                                </div>
                                <button 
                                    onClick={() => onBuyPrestigeUpgrade(upgrade.id)}
                                    disabled={isPurchased || !canAfford}
                                    className="px-2 py-1 text-xs bg-purple-600 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    {isPurchased ? 'Acheté' : `Coût: ${upgrade.cost}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Popup>
    );
};

export default PrestigePopup;