import React from 'react';
import Popup from './Popup';
import { CORE_UPGRADES } from '../../constants';

interface CoreUpgradesPopupProps {
    shards: number;
    purchasedUpgrades: string[];
    onBuyUpgrade: (id: string) => void;
    onClose: () => void;
}

const CoreUpgradesPopup: React.FC<CoreUpgradesPopupProps> = ({
    shards,
    purchasedUpgrades,
    onBuyUpgrade,
    onClose,
}) => {
    return (
        <Popup title="Réacteur Quantique" onClose={onClose}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-[var(--bg-main)] p-3 rounded-lg text-center">
                    <p className="text-lg">Vous avez <strong className="text-purple-400">{shards}</strong> Fragments Quantiques.</p>
                    <p className="text-sm opacity-80">Améliorez le Cœur de façon permanente.</p>
                </div>

                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg">
                     <h3 className="text-lg text-[var(--text-bright)] mb-2">Calibrations du Cœur</h3>
                     <div className="space-y-2">
                        {CORE_UPGRADES.map(upgrade => {
                            const isPurchased = purchasedUpgrades.includes(upgrade.id);
                            const canAfford = shards >= upgrade.cost;
                            return (
                                <div key={upgrade.id} className={`p-2 rounded flex justify-between items-center ${isPurchased ? 'bg-green-800/50' : 'bg-black/20'}`}>
                                    <div>
                                        <strong>{upgrade.name}</strong>
                                        <p className="text-xs opacity-80">{upgrade.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onBuyUpgrade(upgrade.id)}
                                        disabled={isPurchased || !canAfford}
                                        className="text-sm px-3 py-1 rounded bg-purple-600 text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:enabled:bg-purple-500"
                                    >
                                        {isPurchased ? 'Acheté' : `Coût: ${upgrade.cost} FQ`}
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

export default CoreUpgradesPopup;