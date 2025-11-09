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
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                {upgrades.length > 0 ? upgrades.map((item) => (
                    <UpgradeItem 
                        key={item.upgradeData.id} 
                        id={`upgrade-${item.upgradeData.id}`}
                        upgrade={item.upgradeData} 
                        onBuy={() => onBuyUpgrade(item.originalIndex)} 
                        formatNumber={formatNumber} 
                    />
                )) : (
                    <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        Aucune amélioration disponible.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpgradeList;