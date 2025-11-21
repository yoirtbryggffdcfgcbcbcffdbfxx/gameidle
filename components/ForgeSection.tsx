
import React, { useRef, useMemo, useEffect, useState } from 'react';
import UpgradeList from './UpgradeList';
import { useGameContext } from '../contexts/GameContext';
import { useForge } from '../hooks/ui/useForge';
import SectionHeader from './ui/SectionHeader';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
import CategoryDial from './ui/CategoryDial';
import AmountDial from './ui/AmountDial';
import ForgeHelpPopup from './popups/ForgeHelpPopup';

const ForgeSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, memoizedFormatNumber, playSfx } = useGameContext();
    const { energy, purchasedShopUpgrades, viewedCategories } = gameState;
    const { visibleUpgrades, costMultiplier, newlyVisibleUpgradeIds, newlyVisibleUpgradeTypes } = computedState;
    const { tutorialStep } = uiState;
    const { onBuyUpgrade, onBuyTierUpgrade, markCategoryAsViewed } = handlers;
    const [showHelp, setShowHelp] = useState(false);
    
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
            {/* UNIFIED GLASS PANEL STYLE */}
            <div className="w-full max-w-4xl h-[85vh] bg-[#0a0a12]/70 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                
                {/* Header Section */}
                <div className="p-4 pb-2 flex-shrink-0 z-20">
                    <SectionHeader title="La Forge" energy={energy} formatNumber={memoizedFormatNumber} />
                </div>

                {/* Control Deck (Sticky) */}
                <div className="sticky top-0 bg-[#0a0a12]/95 border-y border-white/10 shadow-lg z-[1002] backdrop-blur-md flex flex-col">
                    {/* Decorative tech lines */}
                    <div className="absolute top-0 left-0 h-full w-1 bg-cyan-500/20"></div>
                    <div className="absolute top-0 right-0 h-full w-1 bg-purple-500/20"></div>

                    {/* Row 1: Info Header & Help Button */}
                    {/* pl-16 on mobile to clear the fixed MessageButton */}
                    <div className="flex justify-between items-center px-4 py-1.5 border-b border-white/5 pl-16 lg:pl-4">
                        <span className="text-[9px] md:text-[10px] text-cyan-500/70 font-mono uppercase tracking-[0.2em]">
                            // SYSTÈMES DE CONTRÔLE
                        </span>
                        <button 
                            onClick={() => setShowHelp(true)}
                            className="w-5 h-5 rounded-full border border-cyan-500/50 text-cyan-500 text-[10px] flex items-center justify-center hover:bg-cyan-500/20 transition-colors"
                            title="Manuel de la Forge"
                        >
                            ?
                        </button>
                    </div>

                    {/* Row 2: The Dials (Side by Side) */}
                    <div className="flex justify-between items-center px-3 py-2 gap-2">
                        <div className="flex-shrink-0 z-10">
                            <CategoryDial
                                tabs={tabs}
                                activeTabId={activeTab}
                                onTabSelect={setActiveTab}
                                hasGlobalNotification={hasUnseenNotifications}
                            />
                        </div>
                        
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent mx-2"></div>

                        <div className="flex-shrink-0 z-10">
                            <AmountDial
                                options={buyOptions}
                                activeOption={buyAmount}
                                onOptionSelect={setBuyAmount}
                            />
                        </div>
                    </div>
                </div>

                {/* List Content */}
                <div ref={scrollableRef} id="upgrades-hub" className="flex-grow overflow-y-auto custom-scrollbar p-2 sm:p-4 space-y-2 scroll-contain bg-transparent">
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
                    
                    {/* Bottom spacer for aesthetics */}
                    <div className="h-8"></div>
                </div>
                
                {/* Footer decoration */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-900/0 via-cyan-500/20 to-cyan-900/0 absolute bottom-0 left-0 pointer-events-none"></div>

                {/* Help Popup */}
                {showHelp && <ForgeHelpPopup onClose={() => setShowHelp(false)} />}
            </div>
        </section>
    );
};

export default ForgeSection;
