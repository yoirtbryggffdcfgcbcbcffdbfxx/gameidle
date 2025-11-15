import React from 'react';
import { GameState } from '../../../types';
import StatCard from '../../ui/StatCard';
import StatsSection from './StatsSection';

import ArchiveIcon from '../../ui/ArchiveIcon';
import BarChartIcon from '../../ui/BarChartIcon';
import DollarSignIcon from '../../ui/DollarSignIcon';
import ActivityIcon from '../../ui/ActivityIcon';

interface BankStatsProps {
    gameState: GameState;
    bankBonuses: { savingsInterest: number; loanInterest: number; };
    memoizedFormatNumber: (num: number) => string;
}

const BankStats: React.FC<BankStatsProps> = ({ gameState, bankBonuses, memoizedFormatNumber }) => {
    const {
        savingsBalance,
        bankLevel,
        currentLoan
    } = gameState;
    const iconClass = "w-5 h-5 mx-auto";

    return (
        <StatsSection title="Banque" icon={<ArchiveIcon className="w-4 h-4" />}>
            <StatCard 
                icon={<ArchiveIcon className={iconClass} />}
                label="Épargne"
                value={memoizedFormatNumber(savingsBalance)}
            />
            <StatCard 
                icon={<BarChartIcon className={iconClass} />}
                label="Niveau Banque"
                value={bankLevel}
            />
            {currentLoan && (
                 <StatCard
                    icon={<DollarSignIcon className={iconClass} />}
                    label="Prêt Restant"
                    value={memoizedFormatNumber(currentLoan.remaining)}
                />
            )}
            <StatCard 
                icon={<ActivityIcon className={iconClass} />}
                label="Taux Épargne"
                value={`${(bankBonuses.savingsInterest * 100).toFixed(1)}%/s`}
            />
             <StatCard 
                icon={<DollarSignIcon className={iconClass} />}
                label="Intérêt Prêt"
                value={`${(bankBonuses.loanInterest * 100).toFixed(0)}%`}
            />
        </StatsSection>
    );
};

export default BankStats;
