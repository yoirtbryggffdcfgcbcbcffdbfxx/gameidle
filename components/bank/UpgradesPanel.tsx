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
        <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg">
           <h3 className="text-base sm:text-lg text-yellow-400 mb-4 text-center">Progression de la Banque</h3>
           <div className="relative w-full max-w-md mx-auto">
               {/* Timeline */}
               <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-600"></div>
               <ul className="space-y-8">
                   {BANK_UPGRADES.map((upgrade, index) => {
                       const isUnlocked = bankLevel >= index;
                       const isNext = bankLevel + 1 === index;
                       return (
                           <li key={index} className="flex items-center">
                               <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${isUnlocked ? 'bg-green-600 border-green-400' : 'bg-gray-700 border-gray-500'}`}>
                                   {isUnlocked ? '✓' : index}
                               </div>
                               <div className={`ml-2 sm:ml-4 transition-opacity duration-300 ${!isUnlocked && !isNext ? 'opacity-50' : ''}`}>
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
                       <p className="text-base sm:text-lg text-cyan-300 my-2">{nextUpgrade.description}</p>
                       <button onClick={onUpgradeBank} disabled={energy < nextUpgrade.cost || !!currentLoan} className="px-3 py-2 sm:px-4 rounded bg-cyan-700 hover:enabled:bg-cyan-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                           Coût: {formatNumber(nextUpgrade.cost)} ⚡
                       </button>
                       {!!currentLoan && (
                           <p className="text-red-400 text-center text-xs mt-2 flex items-center justify-center gap-2">
                               <span className="text-lg">🔒</span> Vous ne pouvez pas améliorer la banque avec un prêt en cours.
                           </p>
                       )}
                   </div>
               ) : (
                   <p className="text-green-400 text-center">🏆 Banque au niveau maximum !</p>
               )}
           </div>
        </div>
    );
};

export default UpgradesPanel;
