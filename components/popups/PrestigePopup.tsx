import React from 'react';
import Popup from './Popup';
import { MAX_ENERGY } from '../../constants';

interface PrestigePopupProps {
    canPrestige: boolean;
    energy: number;
    totalUpgradesOwned: number;
    onPrestige: () => void;
    onClose: () => void;
    formatNumber: (num: number) => string;
}

const PrestigePopup: React.FC<PrestigePopupProps> = ({ canPrestige, energy, totalUpgradesOwned, onPrestige, onClose, formatNumber }) => {
    return (
        <Popup title="Prestige" onClose={onClose}>
            {!canPrestige ? (
                <div>
                    <p>Conditions non remplies :</p>
                    <ul className="list-disc list-inside">
                        <li className={energy >= MAX_ENERGY ? 'text-green-400' : 'text-red-400'}>Énergie ≥ {formatNumber(MAX_ENERGY)}</li>
                        <li className={totalUpgradesOwned >= 10 ? 'text-green-400' : 'text-red-400'}>Total Upgrades ≥ 10</li>
                    </ul>
                </div>
            ) : (
                <div>
                    <p>Conditions remplies !</p>
                    <p className="my-2 text-sm opacity-80">Réinitialise votre progression (sauf les points de prestige) pour un bonus permanent de production.</p>
                    <button onClick={onPrestige} className="w-full bg-green-600 text-white p-2 rounded mt-2">Faire Prestige</button>
                </div>
            )}
        </Popup>
    );
};

export default PrestigePopup;
