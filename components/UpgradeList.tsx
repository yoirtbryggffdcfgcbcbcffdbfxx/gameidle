import React from 'react';
import { Upgrade } from '../types';
import UpgradeItem from './UpgradeItem';

interface UpgradeListProps {
    upgrades: Upgrade[];
    onBuyUpgrade: (index: number) => void;
    formatNumber: (num: number) => string;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, onBuyUpgrade, formatNumber }) => {
    return (
        <main className="flex-grow mx-2 md:mx-4 my-2 border-t border-[var(--border-color)] pt-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 160px)' }}>
            {upgrades.map((u, i) => (
                <UpgradeItem key={u.name} upgrade={u} onBuy={() => onBuyUpgrade(i)} formatNumber={formatNumber} />
            ))}
        </main>
    );
};

export default UpgradeList;