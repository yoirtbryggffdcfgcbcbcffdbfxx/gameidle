import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { formatDuration } from '../../utils/helpers';
import StatDisplay from '../ui/StatDisplay';
import ZapIcon from '../ui/ZapIcon';
import MousePointerIcon from '../ui/MousePointerIcon';
import ActivityIcon from '../ui/ActivityIcon';
import ClockIcon from '../ui/ClockIcon';

const StatsGrid: React.FC = () => {
    const { gameState, computedState, memoizedFormatNumber } = useGameContext();
    const { currentLoan, purchasedShopUpgrades, isCoreUnlocked, coreCharge, isCoreDischarging } = gameState;
    const { productionTotal, clickPower, avgProductionLast10s, timeToFullSeconds } = computedState;

    const showEPSMeter = purchasedShopUpgrades.includes('eps_meter');

    return (
        <div id="stats-display-container" className="grid grid-cols-2 gap-2">
            <div id="stat-prod">
                <StatDisplay 
                    label="Prod/sec" 
                    value={memoizedFormatNumber(productionTotal)} 
                    icon={<ZapIcon className="w-4 h-4" />}
                    colorClass="text-yellow-300" 
                    showRepaymentIndicator={!!currentLoan}
                />
            </div>
            <div id="stat-click">
                <StatDisplay label="Clic" value={memoizedFormatNumber(clickPower)} icon={<MousePointerIcon className="w-4 h-4" />} colorClass="text-cyan-300" />
            </div>
            {showEPSMeter && (
                <div id="stat-avg-prod">
                    <StatDisplay 
                        label="Prod. Moy (10s)" 
                        value={memoizedFormatNumber(avgProductionLast10s)} 
                        icon={<ActivityIcon className="w-4 h-4" />} 
                        colorClass="text-green-300" 
                    />
                </div>
            )}
             {isCoreUnlocked && !isCoreDischarging && coreCharge < 100 && (
                <div id="stat-core-charge-time">
                    <StatDisplay 
                        label="Temps de Charge" 
                        value={formatDuration(timeToFullSeconds)} 
                        icon={<ClockIcon className="w-4 h-4" />} 
                        colorClass="text-purple-300" 
                    />
                </div>
            )}
        </div>
    );
};

export default StatsGrid;