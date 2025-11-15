import React from 'react';
import { GameState } from '../../types';
import { BANK_UPGRADES } from '../../data/bank';

interface UpgradesPanelProps {
    bankLevel: number;
    energy: number;
    currentLoan: GameState['currentLoan'];
    onUpgradeBank: () => void;
    formatNumber: (num: number) => string;
}

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ bankLevel, energy, currentLoan, onUpgradeBank, formatNumber }) => {
    const nextUpgrade = bankLevel < BANK_UPGRADES.length - 1 ? BANK_UPGRADES[bankLevel + 1] : null;

    return (
        <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col border border-yellow-500/30 shadow-lg">
           <h3 className="text-lg text-yellow-300 mb-4 text-center">
                Hub d'Améliorations
           </h3>
           <div className="relative w-full max-w-md mx-auto flex-grow">
               <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-600"></div>
               <ul className="space-y-8">
                   {BANK_UPGRADES.map((upgrade, index) => {
                       const isUnlocked = bankLevel >= index;
                       const isNext = bankLevel + 1 === index;
                       return (
                           <li key={index} className="flex items-center">
                               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 ${
                                   isUnlocked ? 'bg-green-600 border-green-400' : 'bg-gray-700 border-gray-500'
                                }`}>
                                   {isUnlocked ? '✓' : index}
                               </div>
                               <div className={`ml-4 transition-opacity duration-300 ${!isUnlocked && !isNext ? 'opacity-50' : ''}`}>
                                   <p className={`font-bold ${isUnlocked ? 'text-green-400' : (isNext ? 'text-yellow-400' : 'text-gray-400')}`}>Niveau {index}</p>
                                   <p className="text-xs">{upgrade.description}</p>
                               </div>
                           </li>
                       );
                   })}
               </ul>
           </div>
           
           <div className="mt-8 border-t border-white/10 pt-4">
               {nextUpgrade ? (
                   <div className="text-center">
                       <p className="text-sm">Prochaine Amélioration :</p>
                       <p className="text-base text-cyan-300 my-2">{nextUpgrade.description}</p>
                       <button onClick={onUpgradeBank} disabled={energy < nextUpgrade.cost || !!currentLoan} className="w-full p-2 rounded-md bg-cyan-700 hover:enabled:bg-cyan-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-bold">
                           Améliorer ({formatNumber(nextUpgrade.cost)} ⚡)
                       </button>
                       {!!currentLoan && (
                           <p className="text-red-400 text-center text-xs mt-2">
                               🔒 Prêt en cours
                           </p>
                       )}
                   </div>
               ) : (
                   <p className="text-green-400 text-center font-bold">🏆 Banque au niveau maximum !</p>
               )}
           </div>
        </div>
    );
};

export default UpgradesPanel;
