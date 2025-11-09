import React from 'react';
import { Upgrade } from '../types';
import UpgradeItem from './UpgradeItem';

interface EnrichedUpgradeItem {
    upgradeData: Upgrade;
    originalIndex: number;
    productionContribution?: number;
    efficiencyScore?: number;
}

interface UpgradeListProps {
    upgrades: EnrichedUpgradeItem[];
    onBuyUpgrade: (index: number) => void;
    formatNumber: (num: number) => string;
    energy: number;
    costMultiplier: number;
    mostEfficientId: string | null;
    buyAmount: 1 | 10 | 100 | 'MAX';
}

const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, onBuyUpgrade, formatNumber, energy, costMultiplier, mostEfficientId, buyAmount }) => {
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
                    onBuy={() => onBuyUpgrade(item.originalIndex)} 
                    formatNumber={formatNumber}
                    energy={energy}
                    costMultiplier={costMultiplier}
                    buyAmount={buyAmount}
                    productionContribution={item.productionContribution}
                    isMostEfficient={item.upgradeData.id === mostEfficientId}
                />
            ))}
        </>
    );
};

export default UpgradeList;