import React, { useState, useMemo } from 'react';
import { Upgrade } from '../types';
import UpgradeList from './UpgradeList';

// Define props based on what's passed from GameUI
interface ForgeSectionProps {
    energy: number;
    formatNumber: (num: number) => string;
    visibleUpgrades: { upgradeData: Upgrade; originalIndex: number; }[];
    onBuyUpgrade: (index: number, amount: number | 'MAX') => void;
    productionTotal: number;
    costMultiplier: number;
    playSfx: (sound: 'ui_hover' | 'click') => void;
    purchasedShopUpgrades: string[];
}

// Local header component for this section, margin removed to work with grid gap
const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);


const ForgeSection: React.FC<ForgeSectionProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'PRODUCTION' | 'CLICK' | 'BOOSTER'>('PRODUCTION');
    const [buyAmount, setBuyAmount] = useState<1 | 10 | 100 | 'MAX'>(1);

    const tabs: { id: 'PRODUCTION' | 'CLICK' | 'BOOSTER'; name: string; icon: string; }[] = [
        { id: 'PRODUCTION', name: 'Production', icon: '⚡' },
        { id: 'CLICK', name: 'Clic', icon: '🖱️' },
        { id: 'BOOSTER', name: 'Booster', icon: '🚀' },
    ];

    const buyOptions: (1 | 10 | 100 | 'MAX')[] = [1, 10, 100, 'MAX'];

    const enrichedAndFilteredUpgrades = useMemo(() => {
        const filtered = props.visibleUpgrades.filter(item => item.upgradeData.type === activeTab);
        
        if (activeTab !== 'PRODUCTION') return filtered;

        const withStats = filtered.map(item => {
            const upgrade = item.upgradeData;
            let productionContribution = 0;
            let efficiencyScore = 0;
            
            if (props.productionTotal > 0) {
                const itemProduction = upgrade.production * upgrade.owned;
                productionContribution = (itemProduction / props.productionTotal) * 100;
            }
            // Efficiency is based on NEXT level production vs cost
            efficiencyScore = upgrade.currentCost > 0 ? upgrade.production / upgrade.currentCost : Infinity;

            return {
                ...item,
                productionContribution,
                efficiencyScore,
            };
        });

        return withStats.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
    }, [props.visibleUpgrades, activeTab, props.productionTotal]);
    
    const mostEfficientId = useMemo(() => {
        if (!props.purchasedShopUpgrades.includes('efficiency_analyzer')) {
            return null;
        }

        if (activeTab === 'PRODUCTION' && enrichedAndFilteredUpgrades.length > 0) {
            // After sorting, the first one is the most efficient. Check if it's affordable.
            const first = enrichedAndFilteredUpgrades[0];
            if (props.energy >= first.upgradeData.currentCost) {
                return first.upgradeData.id;
            }
        }
        return null;
    }, [enrichedAndFilteredUpgrades, activeTab, props.energy, props.purchasedShopUpgrades]);

    return (
        <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 grid grid-rows-[auto_auto_1fr] gap-y-3">
            {/* Row 1: Header */}
            <SectionHeader title="La Forge" energy={props.energy} formatNumber={props.formatNumber} />
            
            {/* Row 2: Controls */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                 {/* Tabs */}
                <div className="flex-grow flex justify-center sm:justify-start border-b border-[var(--border-color)]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { props.playSfx('click'); setActiveTab(tab.id); }}
                            className={`px-4 py-2 text-xs sm:text-sm transition-all duration-300 relative ${activeTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            {tab.icon} {tab.name}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                        </button>
                    ))}
                </div>
                 {/* Buy Amount Selector */}
                <div className="bg-black/30 p-1 rounded-md flex items-center gap-1">
                    <span className="text-xs px-2">Acheter:</span>
                    {buyOptions.map(amount => (
                        <button
                            key={amount}
                            onClick={() => { props.playSfx('click'); setBuyAmount(amount); }}
                            className={`px-3 py-1 text-xs rounded transition-colors ${buyAmount === amount ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            x{amount}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 3: List. `min-h-0` is crucial for preventing overflow issues in grid/flex containers. */}
            <div id="upgrades-hub" className="overflow-y-auto custom-scrollbar pr-2 min-h-0">
                <UpgradeList 
                    upgrades={enrichedAndFilteredUpgrades}
                    onBuyUpgrade={(index) => props.onBuyUpgrade(index, buyAmount)}
                    formatNumber={props.formatNumber}
                    energy={props.energy}
                    costMultiplier={props.costMultiplier}
                    mostEfficientId={mostEfficientId}
                    buyAmount={buyAmount}
                />
            </div>
        </div>
    );
};

export default ForgeSection;