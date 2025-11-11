import React, { useState, useMemo } from 'react';
import AchievementsPopup from './popups/AchievementsPopup';
import ShopPopup from './popups/ShopPopup';
import SettingsPopup from './popups/SettingsPopup';
import { useGameContext } from '../contexts/GameContext';
import { getNextFragmentCost } from '../data/quantumFragments';

interface Tab {
    id: string;
    name: string;
    icon: React.ReactNode;
    condition: boolean;
    hasNotification?: boolean;
}

const CommandCenterSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups, playSfx, memoizedFormatNumber } = useGameContext();
    const { energy, quantumShards, achievements, purchasedShopUpgrades, isShopUnlocked, hasUnseenShopItems, isCoreUnlocked } = gameState;
    const { achievementBonuses } = computedState;
    const { settings, tutorialStep } = uiState;
    const { onBuyShopUpgrade, onSettingsChange, markShopItemsAsSeen, onBuyQuantumShard } = handlers;
    const { setShowHardResetConfirm, setTutorialStep } = popups;
    
    const [activeCommandCenterTab, setActiveCommandCenterTab] = useState('achievements');
    const canAffordFragment = useMemo(() => isCoreUnlocked && energy >= getNextFragmentCost(quantumShards), [isCoreUnlocked, energy, quantumShards]);

    const handleCommandCenterTabClick = (tab: string) => {
        setActiveCommandCenterTab(tab);
        if (tab === 'achievements' && tutorialStep === 9) {
            setTutorialStep(10);
        }
    };

    const commandCenterTabs: Tab[] = [
        { id: 'achievements', name: 'Succès', icon: <span className="text-xl">🏆</span>, condition: true },
        { id: 'shop', name: 'Boutique', icon: <span className="text-xl">🛍️</span>, condition: isShopUnlocked, hasNotification: hasUnseenShopItems || canAffordFragment },
        { id: 'settings', name: 'Paramètres', icon: <span className="text-xl">⚙️</span>, condition: true },
    ].filter(tab => tab.condition);

    return (
        <section id="command-center" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col relative overflow-hidden">
                <div className="w-full flex justify-center items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl text-[var(--text-header)]">Commandement</h2>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex justify-center border-b border-[var(--border-color)] mb-4 flex-shrink-0">
                    {commandCenterTabs.map(tab => (
                        <button
                            key={tab.id}
                            id={`tab-desktop-${tab.id}`}
                            onClick={() => handleCommandCenterTabClick(tab.id)}
                            className={`px-4 py-2 text-sm md:text-base transition-all duration-300 relative ${activeCommandCenterTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            <span className="relative flex items-center gap-2">
                                {tab.name}
                                {tab.hasNotification && (
                                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse-red"></span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-hidden pb-16 md:pb-0">
                    {activeCommandCenterTab === 'achievements' && (
                        <AchievementsPopup achievements={achievements} achievementBonuses={achievementBonuses} onClose={() => { }} />
                    )}
                    {isShopUnlocked && activeCommandCenterTab === 'shop' && (
                         <ShopPopup
                            quantumShards={quantumShards}
                            energy={energy}
                            purchasedShopUpgrades={purchasedShopUpgrades}
                            onBuy={onBuyShopUpgrade}
                            formatNumber={memoizedFormatNumber}
                            hasUnseenShopItems={hasUnseenShopItems}
                            isCoreUnlocked={isCoreUnlocked}
                            onBuyQuantumShard={onBuyQuantumShard}
                            markShopItemsAsSeen={markShopItemsAsSeen}
                            canAffordFragment={canAffordFragment}
                        />
                    )}
                    {activeCommandCenterTab === 'settings' && (
                        <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => { }} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
                    )}
                </div>
                
                {/* Mobile Bottom Nav */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-sm border-t border-white/10 flex justify-around items-center">
                     {commandCenterTabs.map(tab => (
                        <button
                            key={tab.id}
                            id={`tab-mobile-${tab.id}`}
                            onClick={() => handleCommandCenterTabClick(tab.id)}
                            className={`flex flex-col items-center justify-center text-xs transition-colors relative w-1/3 h-full ${activeCommandCenterTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            {activeCommandCenterTab === tab.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[var(--text-header)] rounded-full"></div>}
                            <div className="relative">
                                {tab.icon}
                                {tab.hasNotification && (
                                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </div>
                            <span className="mt-1">{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CommandCenterSection;