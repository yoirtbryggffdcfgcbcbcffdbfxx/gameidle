import React, { useRef, useMemo } from 'react';
import UpgradeList from './UpgradeList';
import { useGameContext } from '../contexts/GameContext';
import { useForge } from '../hooks/ui/useForge';
import SectionHeader from './ui/SectionHeader';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';

const ForgeSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, memoizedFormatNumber, playSfx } = useGameContext();
    const { energy, purchasedShopUpgrades, viewedCategories } = gameState;
    const { visibleUpgrades, costMultiplier, newlyVisibleUpgradeIds, newlyVisibleUpgradeTypes } = computedState;
    const { tutorialStep } = uiState;
    const { onBuyUpgrade, markCategoryAsViewed } = handlers;
    
    const {
        activeTab,
        setActiveTab,
        buyAmount,
        setBuyAmount,
        enrichedAndFilteredUpgrades,
        mostEfficientId,
        tabs,
        buyOptions,
        showEfficiencyPercentage,
    } = useForge({
        visibleUpgrades,
        energy,
        purchasedShopUpgrades,
        playSfx,
        newlyVisibleUpgradeIds: tutorialStep === 0 ? newlyVisibleUpgradeIds : [],
        newlyVisibleUpgradeTypes: tutorialStep === 0 ? newlyVisibleUpgradeTypes : new Set(),
        viewedCategories: useMemo(() => new Set(viewedCategories), [viewedCategories]),
        onTabClick: markCategoryAsViewed,
    });
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);
    
    return (
        <section id="forge" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 grid grid-rows-[auto_auto_1fr] gap-y-3">
                <SectionHeader title="La Forge" energy={energy} formatNumber={memoizedFormatNumber} />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex flex-wrap justify-center sm:justify-start border-b sm:border-b-0 border-[var(--border-color)] w-full sm:w-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-xs sm:text-sm transition-all duration-300 relative ${activeTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                            >
                                <span className="relative flex items-center">
                                    {tab.icon} {tab.name}
                                    {tab.hasNotification && (
                                        <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-red"></span>
                                    )}
                                </span>
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                            </button>
                        ))}
                    </div>
                    <div className="bg-black/30 p-1 rounded-md flex flex-wrap items-center gap-1 justify-center w-full sm:w-auto">
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

                <div ref={scrollableRef} id="upgrades-hub" className="overflow-y-auto custom-scrollbar pr-2 min-h-0 scroll-contain">
                    <UpgradeList 
                        upgrades={enrichedAndFilteredUpgrades}
                        onBuyUpgrade={(index) => onBuyUpgrade(index, buyAmount)}
                        formatNumber={memoizedFormatNumber}
                        energy={energy}
                        costMultiplier={costMultiplier}
                        mostEfficientId={mostEfficientId}
                        buyAmount={buyAmount}
                        showEfficiencyPercentage={showEfficiencyPercentage}
                    />
                </div>
            </div>
        </section>
    );
};

export default ForgeSection;