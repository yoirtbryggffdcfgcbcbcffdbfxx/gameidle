import React from 'react';
import { GameState } from '../../../types';
import { QUANTUM_PATHS } from '../../../data/quantumPaths';
import StatCard from '../../ui/StatCard';
import StatsSection from './StatsSection';

import CpuIcon from '../../ui/CpuIcon';
import PackageIcon from '../../ui/PackageIcon';
import LayersIcon from '../../ui/LayersIcon';
import StarIcon from '../../ui/StarIcon';
import ClockIcon from '../../ui/ClockIcon';
import GitBranchIcon from '../../ui/GitBranchIcon';

interface CoreStatsProps {
    gameState: GameState;
    coreBonuses: { chargeRate: number; multiplier: number; duration: number; };
    memoizedFormatNumber: (num: number) => string;
}

const CoreStats: React.FC<CoreStatsProps> = ({ gameState, coreBonuses, memoizedFormatNumber }) => {
    const { 
        quantumShards,
        quantumPathLevel,
        chosenQuantumPath
    } = gameState;
    const iconClass = "w-5 h-5 mx-auto";

    return (
        <StatsSection title="Cœur Quantique" icon={<CpuIcon className="w-4 h-4" />}>
            <StatCard 
                icon={<PackageIcon className={iconClass} />}
                label="Fragments Quantiques"
                value={memoizedFormatNumber(quantumShards)}
            />
            <StatCard 
                icon={<LayersIcon className={iconClass} />}
                label="Niveau de Voie"
                value={quantumPathLevel}
            />
             <StatCard 
                icon={<StarIcon className={iconClass} />}
                label="Multi. Boost"
                value={`x${coreBonuses.multiplier.toFixed(2)}`}
            />
            <StatCard 
                icon={<ClockIcon className={iconClass} />}
                label="Vitesse de Charge"
                value={`x${coreBonuses.chargeRate.toFixed(2)}`}
            />
            <StatCard 
                icon={<GitBranchIcon className={iconClass} />}
                label="Voie Choisie"
                value={chosenQuantumPath ? QUANTUM_PATHS[chosenQuantumPath].name : 'Aucune'}
            />
        </StatsSection>
    );
};

export default CoreStats;
