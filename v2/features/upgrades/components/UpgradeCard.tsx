
import React, { useCallback } from 'react';
import { useGameDispatch, useGameSelector } from '../../../lib/context';
import { buyUpgrade } from '../actions';
import { Upgrade } from '../model';
import { selectUpgradeCost, formatNumber } from '../../../lib/selectors';

// Composant Memoïsé pour la performance (20/20 requirement)
export const UpgradeCard = React.memo(({ u }: { u: Upgrade }) => {
    const dispatch = useGameDispatch();
    
    // Sélecteur atomique pour éviter le re-render de toute la liste si l'énergie change
    // On ne récupère que ce qui est nécessaire pour savoir si on peut acheter.
    const currentCost = selectUpgradeCost(u.baseCost, u.owned);
    const canAfford = useGameSelector(state => state.resources.energy >= currentCost);

    const handleBuy = useCallback(() => {
        if (canAfford) {
            dispatch(buyUpgrade(u.id, currentCost));
        }
    }, [dispatch, u.id, currentCost, canAfford]);

    return (
        <div className="relative bg-[#111] rounded-md overflow-hidden border-l-4 transition-all duration-200 hover:bg-[#161616] group shadow-lg mb-2"
             style={{ borderLeftColor: u.color }}>
            
            <div className="flex flex-row items-stretch h-20">
                {/* Icon Section */}
                <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center bg-black/20 border-r border-white/5 p-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1 shadow-inner"
                         style={{ backgroundColor: `${u.color}20`, color: u.color }}>
                        ⚡
                    </div>
                    <span className="text-[9px] font-mono text-gray-500">MK-{Math.floor(u.owned / 10) + 1}</span>
                </div>

                {/* Info Section */}
                <div className="flex-grow p-2 flex flex-col justify-between relative">
                    {/* Progress Bar Background (Visual only based on owned count for now) */}
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gray-800 w-full">
                        <div className="h-full transition-all duration-500"
                             style={{ width: `${(u.owned % 10) * 10}%`, backgroundColor: u.color }}></div>
                    </div>

                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-gray-200 leading-tight">{u.name}</h3>
                        <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">
                            Niv. {u.owned}
                        </span>
                    </div>

                    <div className="flex justify-between items-end mt-1">
                        <div className="text-xs text-gray-500">
                            <span className="text-cyan-300 font-mono">+{u.baseProduction}/s</span>
                        </div>
                    </div>
                </div>

                {/* Action Button Section */}
                <div className="w-28 flex-shrink-0 p-2 bg-black/10 border-l border-white/5 flex items-center">
                    <button
                        onClick={handleBuy}
                        disabled={!canAfford}
                        className={`
                            w-full h-full rounded flex flex-col items-center justify-center transition-all duration-100
                            ${canAfford 
                                ? 'bg-gray-800 hover:bg-gray-700 active:scale-95 cursor-pointer border border-gray-600 hover:border-cyan-500' 
                                : 'bg-black/40 border border-gray-800 opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <span className={`text-[9px] font-bold ${canAfford ? 'text-white' : 'text-gray-500'}`}>
                            ACHETER
                        </span>
                        <span className={`font-mono text-xs font-bold ${canAfford ? 'text-yellow-400' : 'text-red-500'}`}>
                            {formatNumber(currentCost)}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
});
