
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
                <div className="flex items-center gap-2">
                    <h3 className="text-base text-yellow-400">📈 Améliorations</h3>
                    {!isExpanded && nextUpgrade && props.energy >= nextUpgrade.cost && !props.currentLoan && (
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full font-mono text-gray-400">v{props.bankLevel}.0</span>
                     <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            
            <div 
                id={contentId}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1200px] mt-4' : 'max-h-0'}`}
            >
                {/* Augmentation de la hauteur pour une meilleure visibilité sur mobile */}
                <div className="h-[65vh] min-h-[400px]">
                    <UpgradesPanel {...props} />
                </div>
            </div>
            
            {!isExpanded && nextUpgrade && (
                <div className="mt-2 flex justify-between items-center text-xs opacity-70 px-1">
                    <span>Prochaine version disponible</span>
                    <span className={props.energy >= nextUpgrade.cost ? 'text-cyan-400' : 'text-red-400'}>{props.formatNumber(nextUpgrade.cost)} ⚡</span>
                </div>
            )}
        </div>
    );
};

export default MobileUpgradesCard;