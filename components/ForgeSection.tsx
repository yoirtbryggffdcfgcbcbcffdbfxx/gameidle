import React from 'react';
import UpgradeList from './UpgradeList';
import { useGameContext } from '../contexts/GameContext';
import { useForge } from '../hooks/ui/useForge'; // Import the new hook

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
    const { energy, purchasedShopUpgrades } = gameState;
    const { visibleUpgrades, productionTotal, costMultiplier } = computedState;
    const { onBuyUpgrade } = handlers;
    
    const {
        activeTab,
        setActiveTab,
        buyAmount,
        setBuyAmount,
        enrichedAndFilteredUpgrades,
        mostEfficientId,
        tabs,
        buyOptions,
    } = useForge({
        visibleUpgrades,
        productionTotal,
        energy,
        purchasedShopUpgrades,
        playSfx,
    });
    
    return (
        <section id="forge" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 grid grid-rows-[auto_auto_1fr] gap-y-3">
                <SectionHeader title="La Forge" energy={energy} formatNumber={memoizedFormatNumber} />
                
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex-grow flex justify-center sm:justify-start border-b border-[var(--border-color)]">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                                onClick={() => setBuyAmount(amount)}
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