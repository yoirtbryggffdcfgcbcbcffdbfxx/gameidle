import React from 'react';
import { Upgrade } from '../types';
import UpgradeItem from './UpgradeItem';

interface EnrichedUpgradeItem {
    upgradeData: Upgrade;
    originalIndex: number;
    productionContribution?: number;
    efficiencyPercentage?: number;
    isNew?: boolean;
}

interface UpgradeListProps {
    upgrades: EnrichedUpgradeItem[];
    onBuyUpgrade: (index: number, amount: 1 | 10 | 100 | 'MAX') => void;
    onBuyTierUpgrade: (index: number) => void;
    formatNumber: (num: number) => string;
    energy: number;
    costMultiplier: number;
    mostEfficientId: string | null;
    buyAmount: 1 | 10 | 100 | 'MAX';
    showEfficiencyPercentage: boolean;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, onBuyUpgrade, onBuyTierUpgrade, formatNumber, energy, costMultiplier, mostEfficientId, buyAmount, showEfficiencyPercentage }) => {
    if (upgrades.length === 0) {
        return (
            <div className="text-center text-gray-400 h-full flex items-center justify-center py-10">
                Aucune amélioration disponible.
            </div>
        );
    }
    
    return (
        <>
            {upgrades.map((item) => (
                <UpgradeItem 
                    key={item.upgradeData.id} 
                    id={`upgrade-${item.upgradeData.id}`}
                    upgrade={item.upgradeData} 
                    onBuy={(amount) => onBuyUpgrade(item.originalIndex, amount)} 
                    onBuyTier={() => onBuyTierUpgrade(item.originalIndex)}
                    formatNumber={formatNumber}
                    energy={energy}
                    costMultiplier={costMultiplier}
                    buyAmount={buyAmount}
                    efficiencyPercentage={item.efficiencyPercentage}
                    isMostEfficient={item.upgradeData.id === mostEfficientId}
                    showEfficiencyPercentage={showEfficiencyPercentage}
                    isNew={item.isNew}
                />
            ))}
        </>
    );
};

export default UpgradeList;