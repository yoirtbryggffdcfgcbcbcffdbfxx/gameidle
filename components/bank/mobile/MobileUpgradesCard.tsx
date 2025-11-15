import React, { useState } from 'react';
import { GameState } from '../../../types';
import UpgradesPanel from '../UpgradesPanel';
import ChevronDownIcon from '../../ui/ChevronDownIcon';
import { BANK_UPGRADES } from '../../../data/bank';

interface MobileUpgradesCardProps {
    bankLevel: number;
    energy: number;
    currentLoan: GameState['currentLoan'];
    onUpgradeBank: () => void;
    formatNumber: (num: number) => string;
}

const MobileUpgradesCard: React.FC<MobileUpgradesCardProps> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentId = `upgrades-content-${props.bankLevel}`;
    const nextUpgrade = props.bankLevel < BANK_UPGRADES.length - 1 ? BANK_UPGRADES[props.bankLevel + 1] : null;

    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="w-full flex justify-between items-center cursor-pointer"
                role="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
            >
                <h3 className="text-base text-yellow-400">📈 Améliorations</h3>
                <div className="flex items-center gap-2">
                     <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">Niv. {props.bankLevel}</span>
                     <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            <div 
                id={contentId}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}
            >
                <UpgradesPanel {...props} />
            </div>
            
            {!isExpanded && nextUpgrade && (
                <div className="mt-3 text-center">
                    <p className="text-xs opacity-80">Prochain Niv: {nextUpgrade.description}</p>
                    <button onClick={props.onUpgradeBank} disabled={props.energy < nextUpgrade.cost || !!props.currentLoan} className="mt-2 w-full max-w-xs mx-auto text-xs px-3 py-1.5 rounded-md bg-cyan-700 hover:enabled:bg-cyan-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Coût: {props.formatNumber(nextUpgrade.cost)} ⚡
                    </button>
                    {!!props.currentLoan && (
                        <p className="text-red-400 text-center text-[10px] mt-1">🔒 Prêt en cours</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MobileUpgradesCard;