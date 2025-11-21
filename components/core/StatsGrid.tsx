
import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import StatDisplay from '../ui/StatDisplay';
import ZapIcon from '../ui/ZapIcon';
import MousePointerIcon from '../ui/MousePointerIcon';
import ActivityIcon from '../ui/ActivityIcon';

interface HolographicStatProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    showRepaymentIndicator?: boolean;
}

const HolographicStat: React.FC<HolographicStatProps> = ({ label, value, icon, color, showRepaymentIndicator }) => (
    <div className="hud-panel p-2 rounded text-center flex flex-col justify-center h-16 transition-all hover:bg-white/5 group">
        <div className={`text-[10px] uppercase opacity-70 mb-1 flex items-center justify-center gap-1 hud-text ${color}`}>
            {icon} {label}
        </div>
        <div className="text-sm md:text-base font-bold text-white hud-text tracking-wider flex items-center justify-center gap-2">
            <span>{value}</span>
            {showRepaymentIndicator && (
                <span className="text-[9px] text-red-500 animate-pulse font-bold bg-red-900/20 px-1.5 py-0.5 rounded border border-red-500/50 whitespace-nowrap" title="50% retenu pour le prêt">
                    -50%
                </span>
            )}
        </div>
    </div>
);

const StatsGrid: React.FC = () => {
    const { gameState, computedState, memoizedFormatNumber } = useGameContext();
    const { currentLoan, purchasedShopUpgrades } = gameState;
    const { netProduction, clickPower, avgProductionLast10s } = computedState;

    const showEPSMeter = purchasedShopUpgrades.includes('eps_meter');
    
    // Layout dynamique : 3 colonnes si le compteur moyenne est actif, sinon 2
    const gridCols = showEPSMeter ? 'grid-cols-3' : 'grid-cols-2';

    return (
        <div id="stats-display-container" className={`grid ${gridCols} gap-3 w-full`}>
            <div id="stat-prod">
                <HolographicStat 
                    label="Output (Net)" 
                    value={`${memoizedFormatNumber(netProduction)}/s`}
                    icon={<ZapIcon className="w-3 h-3" />}
                    color="text-yellow-400" 
                    showRepaymentIndicator={!!currentLoan && currentLoan.remaining > 0}
                />
            </div>
            <div id="stat-click">
                <HolographicStat 
                    label="Manuel" 
                    value={memoizedFormatNumber(clickPower)}
                    icon={<MousePointerIcon className="w-3 h-3" />} 
                    color="text-cyan-400" 
                />
            </div>
            {showEPSMeter && (
                <div id="stat-avg-prod">
                    <HolographicStat 
                        label="Moyenne" 
                        value={`${memoizedFormatNumber(avgProductionLast10s)}/s`}
                        icon={<ActivityIcon className="w-3 h-3" />} 
                        color="text-green-400" 
                    />
                </div>
            )}
        </div>
    );
};

export default StatsGrid;
