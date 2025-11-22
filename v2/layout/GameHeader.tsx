import React from 'react';
import { useGameSelector } from '../lib/context';
import { selectEffectiveProduction, formatNumber } from '../lib/selectors';

interface GameHeaderProps {
    onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(({ onBack }) => {
    // Abonnement spécifique à la production pour éviter les re-renders inutiles du layout parent
    const effectiveProduction = useGameSelector(selectEffectiveProduction);

    return (
        <header className="relative z-20 flex-shrink-0 h-16 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-4 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    V2
                </div>
                <h1 className="hidden md:block text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                    QUANTUM CORE
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-black/40 border border-green-500/30 px-3 py-1 rounded flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-400 font-bold">{formatNumber(effectiveProduction)}/s</span>
                </div>
                
                <button 
                    onClick={onBack}
                    className="px-3 py-1.5 text-[10px] border border-red-500/50 text-red-400 hover:bg-red-900/30 hover:text-white transition-colors rounded uppercase tracking-wider"
                >
                    EXIT
                </button>
            </div>
        </header>
    );
});