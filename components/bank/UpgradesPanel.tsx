
import React, { useMemo } from 'react';
import { GameState } from '../../types';
import { BANK_UPGRADES } from '../../data/bank';
import CheckIcon from '../ui/CheckIcon';
import LockIcon from '../ui/LockIcon';
import ActivityIcon from '../ui/ActivityIcon';
import DollarSignIcon from '../ui/DollarSignIcon';

interface UpgradesPanelProps {
    bankLevel: number;
    energy: number;
    currentLoan: GameState['currentLoan'];
    onUpgradeBank: () => void;
    formatNumber: (num: number) => string;
}

const ServerBlade: React.FC<{ 
    level: number; 
    currentLevel: number; 
    data: typeof BANK_UPGRADES[0];
}> = ({ level, currentLevel, data }) => {
    const state = level < currentLevel ? 'past' : level === currentLevel ? 'current' : level === currentLevel + 1 ? 'next' : 'future';
    
    const styles = {
        past: {
            border: 'border-green-900/30',
            bg: 'bg-green-900/10',
            text: 'text-green-700',
            indicator: 'bg-green-600',
            status: 'ARCHIVÉ'
        },
        current: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-900/20',
            text: 'text-yellow-400',
            indicator: 'bg-yellow-400 animate-pulse',
            status: 'EN LIGNE'
        },
        next: {
            border: 'border-cyan-500',
            bg: 'bg-cyan-900/20',
            text: 'text-cyan-300',
            indicator: 'bg-cyan-400 animate-ping',
            status: 'PRÊT'
        },
        future: {
            border: 'border-gray-700',
            bg: 'bg-gray-900/50',
            text: 'text-gray-600',
            indicator: 'bg-gray-700',
            status: 'CRYPTÉ'
        }
    }[state];

    return (
        <div className={`flex items-center justify-between p-2 mb-1 rounded border-l-4 ${styles.border} ${styles.bg} transition-all`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${styles.indicator}`}></div>
                <div className="min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold ${styles.text}`}>V.{level}.0</span>
                        {state === 'future' && <LockIcon className="w-3 h-3 text-gray-600 flex-shrink-0" />}
                    </div>
                    {state !== 'future' && (
                        <p className="text-[9px] sm:text-[10px] text-gray-400 truncate sm:whitespace-normal">{data.description}</p>
                    )}
                </div>
            </div>
            <div className={`text-[8px] sm:text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-black/30 ${styles.text} flex-shrink-0 ml-2`}>
                {styles.status}
            </div>
        </div>
    );
};

const UpgradesPanel: React.FC<UpgradesPanelProps> = ({ bankLevel, energy, currentLoan, onUpgradeBank, formatNumber }) => {
    const nextUpgrade = bankLevel < BANK_UPGRADES.length - 1 ? BANK_UPGRADES[bankLevel + 1] : null;
    const currentStats = BANK_UPGRADES[bankLevel];

    // Scroll to bottom of list on mount/update if possible, or just show the relevant slice
    const visibleUpgrades = useMemo(() => {
        // Show a few previous, current, next, and a few futures
        return BANK_UPGRADES.map((u, i) => ({ ...u, originalIndex: i }));
    }, []);

    return (
        <div className="bg-[#0a0a0f] p-2 sm:p-4 rounded-lg flex flex-col border border-gray-700 shadow-xl h-full relative overflow-hidden">
            {/* Header / Monitor */}
            <div className="bg-black border border-gray-600 rounded p-2 sm:p-3 mb-2 sm:mb-4 shadow-inner relative overflow-hidden flex-shrink-0">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-20 animate-scan-line"></div>
                 <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
                     <h3 className="text-[10px] sm:text-xs font-mono text-green-500">SYS.FINANCIER.STATUS</h3>
                     <span className="text-[8px] sm:text-[10px] text-green-800 animate-pulse">● CONNECTÉ</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 sm:gap-4">
                     <div className="text-center">
                         <div className="text-[9px] sm:text-[10px] text-gray-500 mb-1">TAUX ÉPARGNE</div>
                         <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                             <span className="text-base sm:text-lg text-white font-bold">{(currentStats.savingsInterest * 100).toFixed(1)}%</span>
                             {nextUpgrade && (
                                 <div className="flex items-center text-xs">
                                    <span className="text-gray-600 mr-1">→</span>
                                    <span className="text-cyan-400">{(nextUpgrade.savingsInterest * 100).toFixed(1)}%</span>
                                 </div>
                             )}
                         </div>
                     </div>
                     <div className="text-center border-l border-gray-800">
                         <div className="text-[9px] sm:text-[10px] text-gray-500 mb-1">TAUX PRÊT</div>
                         <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                             <span className="text-base sm:text-lg text-white font-bold">{(currentStats.loanInterest * 100).toFixed(0)}%</span>
                             {nextUpgrade && (
                                 <div className="flex items-center text-xs">
                                    <span className="text-gray-600 mr-1">→</span>
                                    <span className="text-green-400">{(nextUpgrade.loanInterest * 100).toFixed(0)}%</span>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
            </div>

            {/* Server Rack List */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-1 mb-2 sm:mb-4 bg-black/20 p-1 rounded border border-gray-800/50 min-h-0">
                {visibleUpgrades.map((upgrade) => (
                    <ServerBlade 
                        key={upgrade.originalIndex} 
                        level={upgrade.originalIndex} 
                        currentLevel={bankLevel} 
                        data={upgrade} 
                    />
                ))}
            </div>
           
           {/* Installation Controls */}
           <div className="mt-auto flex-shrink-0">
               {nextUpgrade ? (
                   <button 
                        onClick={onUpgradeBank} 
                        disabled={energy < nextUpgrade.cost || !!currentLoan} 
                        className={`
                            w-full p-3 rounded-sm font-mono text-xs sm:text-sm font-bold uppercase tracking-widest transition-all
                            flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-t-2
                            ${energy >= nextUpgrade.cost && !currentLoan
                                ? 'bg-cyan-900/50 text-cyan-400 border-cyan-500 hover:bg-cyan-800 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'bg-gray-900 text-gray-600 border-gray-700 cursor-not-allowed'
                            }
                        `}
                    >
                        {!currentLoan ? (
                             <>
                                <span>INSTALLER V.{bankLevel + 1}.0</span>
                                <span className="opacity-70">[{formatNumber(nextUpgrade.cost)} ⚡]</span>
                             </>
                        ) : (
                            <span className="text-red-500 flex items-center gap-2"><LockIcon className="w-4 h-4"/> VERROUILLÉ (DETTE)</span>
                        )}
                   </button>
               ) : (
                   <div className="w-full p-3 rounded-sm bg-green-900/20 border border-green-500/50 text-green-400 text-center font-mono text-sm">
                       <CheckIcon className="inline w-4 h-4 mr-2"/>
                       SYSTÈME OPTIMISÉ AU MAX
                   </div>
               )}
           </div>
        </div>
    );
};

export default UpgradesPanel;