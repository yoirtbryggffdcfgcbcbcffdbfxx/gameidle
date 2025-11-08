import React from 'react';
import { Upgrade } from '../types';
import UpgradeItem from './UpgradeItem';

interface UpgradeListProps {
    upgrades: { upgradeData: Upgrade; originalIndex: number; }[];
    onBuyUpgrade: (index: number) => void;
    formatNumber: (num: number) => string;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, onBuyUpgrade, formatNumber }) => {
    return (
        <div className="bg-black/20 rounded-lg p-2 flex flex-col h-full">
            <h2 className="text-lg text-center text-[var(--text-header)] mb-2">Améliorations</h2>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                {upgrades.map((item) => (
                    <UpgradeItem 
                        key={item.upgradeData.id} 
                        id={`upgrade-${item.upgradeData.id}`}
                        upgrade={item.upgradeData} 
                        onBuy={() => onBuyUpgrade(item.originalIndex)} 
                        formatNumber={formatNumber} 
                    />
                ))}
            </div>
        </div>
    );
};

export default UpgradeList;
