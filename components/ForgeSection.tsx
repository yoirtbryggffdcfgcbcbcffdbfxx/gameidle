import React, { useRef, useMemo, useEffect } from 'react';
import UpgradeList from './UpgradeList';
import { useGameContext } from '../contexts/GameContext';
import { useForge } from '../hooks/ui/useForge';
import SectionHeader from './ui/SectionHeader';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
import CategoryDial from './ui/CategoryDial';
import AmountDial from './ui/AmountDial';

const ForgeSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, memoizedFormatNumber, playSfx } = useGameContext();
    const { energy, purchasedShopUpgrades, viewedCategories } = gameState;
    const { visibleUpgrades, costMultiplier, newlyVisibleUpgradeIds, newlyVisibleUpgradeTypes } = computedState;
    const { tutorialStep } = uiState;
    const { onBuyUpgrade, onBuyTierUpgrade, markCategoryAsViewed } = handlers;
    
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
        hasUnseenNotifications,
    } = useForge({
        visibleUpgrades,
        energy,
        purchasedShopUpgrades,
        playSfx,
        newlyVisibleUpgradeIds: tutorialStep === 0 ? newlyVisibleUpgradeIds : [],
        newlyVisibleUpgradeTypes: tutorialStep === 0 ? newlyVisibleUpgradeTypes : new Set(),
        viewedCategories: useMemo(() => new Set(viewedCategories), [viewedCategories]),
        onTabClick: markCategoryAsViewed,
        costMultiplier,
    });
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

    // Lock main page scroll when interacting with the upgrades list to prevent scroll bleed
    useEffect(() => {
        const scrollEl = scrollableRef.current;
        const gameContentEl = document.getElementById('game-content');
        if (!scrollEl || !gameContentEl) return;

        const lockScroll = () => { gameContentEl.style.overflowY = 'hidden'; };
        const unlockScroll = () => { gameContentEl.style.overflowY = 'auto'; };

        scrollEl.addEventListener('mouseenter', lockScroll);
        scrollEl.addEventListener('mouseleave', unlockScroll);
        scrollEl.addEventListener('touchstart', lockScroll, { passive: true });
        scrollEl.addEventListener('touchend', unlockScroll);
        scrollEl.addEventListener('touchcancel', unlockScroll);

        return () => {
            scrollEl.removeEventListener('mouseenter', lockScroll);
            scrollEl.removeEventListener('mouseleave', unlockScroll);
            scrollEl.removeEventListener('touchstart', lockScroll);
            scrollEl.removeEventListener('touchend', unlockScroll);
            scrollEl.removeEventListener('touchcancel', unlockScroll);
            unlockScroll();
        };
    }, []);
    
    return (
        <section id="forge" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 grid grid-rows-[auto_auto_1fr] gap-y-3">
                <SectionHeader title="La Forge" energy={energy} formatNumber={memoizedFormatNumber} />
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <CategoryDial
                        tabs={tabs}
                        activeTabId={activeTab}
                        onTabSelect={setActiveTab}
                        hasGlobalNotification={hasUnseenNotifications}
                    />
                     <AmountDial
                        options={buyOptions}
                        activeOption={buyAmount}
                        onOptionSelect={setBuyAmount}
                    />
                </div>

                <div ref={scrollableRef} id="upgrades-hub" className="overflow-y-auto custom-scrollbar pr-2 min-h-0 scroll-contain">
                    <UpgradeList 
                        upgrades={enrichedAndFilteredUpgrades}
                        onBuyUpgrade={(index, amount) => onBuyUpgrade(index, amount)}
                        onBuyTierUpgrade={(index) => onBuyTierUpgrade(index)}
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