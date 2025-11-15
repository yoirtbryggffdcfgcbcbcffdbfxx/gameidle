import React from 'react';
import { GameState } from '../../../types';
import { formatLongDuration } from '../../../utils/helpers';
import StatCard from '../../ui/StatCard';
import StatsSection from './StatsSection';

import ClockIcon from '../../ui/ClockIcon';
import MousePointerIcon from '../../ui/MousePointerIcon';
import LayersIcon from '../../ui/LayersIcon';
import GlobeIcon from '../../ui/GlobeIcon';
import AwardIcon from '../../ui/AwardIcon';
import ShoppingCartIcon from '../../ui/ShoppingCartIcon';
import BarChartIcon from '../../ui/BarChartIcon';

interface GeneralStatsProps {
    gameState: GameState;
    memoizedFormatNumber: (num: number) => string;
}

const GeneralStats: React.FC<GeneralStatsProps> = ({ gameState, memoizedFormatNumber }) => {
    const { 
        timePlayedInSeconds,
        totalClicks,
        upgrades,
        totalEnergyProduced,
        achievements,
        purchasedShopUpgrades
    } = gameState;

    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    const totalUpgradeLevels = upgrades.reduce((sum, u) => sum + u.owned, 0);
    const iconClass = "w-5 h-5 mx-auto";

    return (
        <StatsSection title="Statistiques Générales" icon={<BarChartIcon className="w-4 h-4" />}>
            <StatCard 
                icon={<ClockIcon className={iconClass} />}
                label="Temps de Jeu"
                value={formatLongDuration(timePlayedInSeconds)}
            />
            <StatCard 
                icon={<MousePointerIcon className={iconClass} />}
                label="Total Clics"
                value={memoizedFormatNumber(totalClicks)}
            />
            <StatCard 
                icon={<LayersIcon className={iconClass} />}
                label="Total Niveaux"
                value={memoizedFormatNumber(totalUpgradeLevels)}
            />
            <StatCard 
                icon={<GlobeIcon className={iconClass} />}
                label="Énergie Totale Produite"
                value={memoizedFormatNumber(totalEnergyProduced)}
            />
            <StatCard 
                icon={<AwardIcon className={iconClass} />}
                label="Succès Débloqués"
                value={`${unlockedAchievements}/${achievements.length}`}
            />
            <StatCard 
                icon={<ShoppingCartIcon className={iconClass} />}
                label="Achats Boutique"
                value={`${purchasedShopUpgrades.length}`}
            />
        </StatsSection>
    );
};

export default GeneralStats;
