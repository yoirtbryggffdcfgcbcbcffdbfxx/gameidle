import React from 'react';
import StatCard from '../../ui/StatCard';
import StatsSection from './StatsSection';
import ZapIcon from '../../ui/ZapIcon';
import MousePointerIcon from '../../ui/MousePointerIcon';
import DollarSignIcon from '../../ui/DollarSignIcon';
import RocketIcon from '../../ui/RocketIcon';

interface BonusStatsProps {
    ascensionBonuses: { productionMultiplier: number; clickMultiplier: number; costReduction: number; };
    achievementBonuses: { production: number; click: number; costReduction: number; };
}

const BonusStats: React.FC<BonusStatsProps> = ({ ascensionBonuses, achievementBonuses }) => {
    
    // Helper to format bonus percentages
    const formatBonus = (value: number, isReduction: boolean = false) => {
        if (isReduction) {
            return `-${((1 - value) * 100).toFixed(0)}%`;
        }
        return `+${((value - 1) * 100).toFixed(0)}%`;
    };

    const iconClass = "w-5 h-5 mx-auto";

    return (
        <StatsSection title="Bonus Actifs Cumulés" icon={<RocketIcon className="w-4 h-4" />}>
            {ascensionBonuses.productionMultiplier > 1 && (
                <StatCard icon={<ZapIcon className={iconClass} />} label="Prod. (Ascension)" value={formatBonus(ascensionBonuses.productionMultiplier)} />
            )}
            {achievementBonuses.production > 1 && (
                <StatCard icon={<ZapIcon className={iconClass} />} label="Prod. (Succès)" value={formatBonus(achievementBonuses.production)} />
            )}
            {ascensionBonuses.clickMultiplier > 1 && (
                <StatCard icon={<MousePointerIcon className={iconClass} />} label="Clic (Ascension)" value={formatBonus(ascensionBonuses.clickMultiplier)} />
            )}
            {achievementBonuses.click > 1 && (
                <StatCard icon={<MousePointerIcon className={iconClass} />} label="Clic (Succès)" value={formatBonus(achievementBonuses.click)} />
            )}
            {ascensionBonuses.costReduction < 1 && (
                <StatCard icon={<DollarSignIcon className={iconClass} />} label="Coût (Ascension)" value={formatBonus(ascensionBonuses.costReduction, true)} />
            )}
            {achievementBonuses.costReduction < 1 && (
                <StatCard icon={<DollarSignIcon className={iconClass} />} label="Coût (Succès)" value={formatBonus(achievementBonuses.costReduction, true)} />
            )}
        </StatsSection>
    );
};

export default BonusStats;
