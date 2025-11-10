import React, { useState, useMemo } from 'react';
import { Upgrade } from '../types';
import UpgradeList from './UpgradeList';
import { useGameContext } from '../contexts/GameContext';

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);

const ForgeSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber, playSfx } = useGameContext();
    // FIX: Get computed properties from `computedState` instead of `gameState`.
    const { energy, purchasedShopUpgrades } = gameState;
    const { visibleUpgrades, productionTotal, costMultiplier } = computedState;
    const { onBuyUpgrade } = handlers;
    
    const [activeTab, setActiveTab] = useState<'PRODUCTION' | 'CLICK' | 'BOOSTER'>('PRODUCTION');
    const [buyAmount, setBuyAmount] = useState<1 | 10 | 100 | 'MAX'>(1);

    const tabs: { id: 'PRODUCTION' | 'CLICK' | 'BOOSTER'; name: string; icon: string; }[] = [
        { id: 'PRODUCTION', name: 'Production', icon: '⚡' },
        { id: 'CLICK', name: 'Clic', icon: '🖱️' },
        { id: 'BOOSTER', name: 'Booster', icon: '🚀' },
    ];

    const buyOptions: (1 | 10 | 100 | 'MAX')[] = [1, 10, 100, 'MAX'];

    const enrichedAndFilteredUpgrades = useMemo(() => {
        const filtered = visibleUpgrades.filter(item => item.upgradeData.type === activeTab);
        
        if (activeTab !== 'PRODUCTION' || productionTotal <= 0) return filtered;

        const withStats = filtered.map(item => {
            const upgrade = item.upgradeData;
            let productionContribution = 0;
            let efficiencyScore = 0;
            
            const itemProduction = upgrade.production * upgrade.owned;
            productionContribution = (itemProduction / productionTotal) * 100;
            
            efficiencyScore = upgrade.currentCost > 0 ? upgrade.production / upgrade.currentCost : Infinity;

            return {
                ...item,
                productionContribution,
                efficiencyScore,
            };
        });

        return withStats.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
    }, [visibleUpgrades, activeTab, productionTotal]);
    
    const mostEfficientId = useMemo(() => {
        if (!purchasedShopUpgrades.includes('efficiency_analyzer')) {
            return null;
        }

        if (activeTab === 'PRODUCTION' && enrichedAndFilteredUpgrades.length > 0) {
            const first = enrichedAndFilteredUpgrades[0];
            if (energy >= first.upgradeData.currentCost) {
                return first.upgradeData.id;
            }
        }
        return null;
    }, [enrichedAndFilteredUpgrades, activeTab, energy, purchasedShopUpgrades]);

    return (
        <section id="forge" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 grid grid-rows-[auto_auto_1fr] gap-y-3">
                <SectionHeader title="La Forge" energy={energy} formatNumber={memoizedFormatNumber} />
                
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex-grow flex justify-center sm:justify-start border-b border-[var(--border-color)]">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { playSfx('click'); setActiveTab(tab.id); }}
                                className={`px-4 py-2 text-xs sm:text-sm transition-all duration-300 relative ${activeTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                            >
                                {tab.icon} {tab.name}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                            </button>
                        ))}
                    </div>
                    <div className="bg-black/30 p-1 rounded-md flex items-center gap-1">
                        <span className="text-xs px-2">Acheter:</span>
                        {buyOptions.map(amount => (
                            <button
                                key={amount}
                                onClick={() => { playSfx('click'); setBuyAmount(amount); }}
                                className={`px-3 py-1 text-xs rounded transition-colors ${buyAmount === amount ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                x{amount}
                            </button>
                        ))}
                    </div>
                </div>

                <div id="upgrades-hub" className="overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    <UpgradeList 
                        upgrades={enrichedAndFilteredUpgrades}
                        onBuyUpgrade={(index) => onBuyUpgrade(index, buyAmount)}
                        formatNumber={memoizedFormatNumber}
                        energy={energy}
                        costMultiplier={costMultiplier}
                        mostEfficientId={mostEfficientId}
                        buyAmount={buyAmount}
                    />
                </div>
            </div>
        </section>
    );
};

export default ForgeSection;
