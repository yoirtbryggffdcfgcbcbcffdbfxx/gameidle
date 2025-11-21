
import React from 'react';
import StatCard from '../../ui/StatCard';
import StatsSection from './StatsSection';
import ZapIcon from '../../ui/ZapIcon';
import MousePointerIcon from '../../ui/MousePointerIcon';
import ActivityIcon from '../../ui/ActivityIcon';

interface ProductionStatsProps {
    productionTotal: number; // This is now passed as netProduction
    clickPower: number;
    avgProductionLast10s: number;
    showAvgProduction: boolean;
    memoizedFormatNumber: (num: number) => string;
}

const ProductionStats: React.FC<ProductionStatsProps> = ({ 
    productionTotal, 
    clickPower, 
    avgProductionLast10s, 
    showAvgProduction, 
    memoizedFormatNumber 
}) => {
    const iconClass = "w-5 h-5 mx-auto";

    return (
        <StatsSection title="Production" icon={<ZapIcon className="w-4 h-4" />}>
            <StatCard 
                icon={<ZapIcon className={iconClass} />}
                label="Prod. Nette / Sec"
                value={`${memoizedFormatNumber(productionTotal)}/s`}
            />
             <StatCard 
                icon={<MousePointerIcon className={iconClass} />}
                label="Énergie par Clic"
                value={memoizedFormatNumber(clickPower)}
            />
            {showAvgProduction && (
                <StatCard 
                    icon={<ActivityIcon className={iconClass} />}
                    label="Prod. Moy (10s)"
                    value={`${memoizedFormatNumber(avgProductionLast10s)}/s`}
                />
            )}
        </StatsSection>
    );
};

export default ProductionStats;