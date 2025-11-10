import React, { useState } from 'react';
import AchievementsPopup from './popups/AchievementsPopup';
import ShopPopup from './popups/ShopPopup';
import SettingsPopup from './popups/SettingsPopup';
import { useGameContext } from '../contexts/GameContext';

const CommandCenterSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups, playSfx, memoizedFormatNumber } = useGameContext();
    // FIX: Get `achievementBonuses` from computed state.
    const { energy, quantumShards, achievements, purchasedShopUpgrades } = gameState;
    const { achievementBonuses } = computedState;
    const { settings, tutorialStep } = uiState;
    const { onBuyShopUpgrade, onSettingsChange } = handlers;
    const { setShowHardResetConfirm, setTutorialStep } = popups;
    
    const [activeCommandCenterTab, setActiveCommandCenterTab] = useState('achievements');

    const handleCommandCenterTabClick = (tab: string) => {
        setActiveCommandCenterTab(tab);
        if (tab === 'achievements' && tutorialStep === 9) {
            setTutorialStep(10);
        }
    };

    return (
        <section id="command-center" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                <div className="w-full flex justify-between items-center mb-4">
                    <h2 className="text-2xl text-center text-[var(--text-header)]">Centre de Commandement</h2>
                    <div className="bg-black/30 px-3 py-1 rounded-lg text-xs flex gap-4">
                        <span className="text-purple-400">⚛️ {memoizedFormatNumber(quantumShards)}</span>
                        <span className="text-cyan-300">⚡ {memoizedFormatNumber(energy)}</span>
                    </div>
                </div>
                <div className="flex justify-center border-b border-[var(--border-color)] mb-4">
                    {['achievements', 'shop', 'settings'].map(tab => (
                        <button
                            key={tab}
                            id={`tab-${tab}`}
                            onClick={() => handleCommandCenterTabClick(tab)}
                            className={`px-4 py-2 text-sm md:text-base transition-all duration-300 relative ${activeCommandCenterTab === tab ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            {tab === 'achievements' ? 'Succès' : tab === 'shop' ? 'Boutique' : 'Paramètres'}
                        </button>
                    ))}
                </div>
                <div className="flex-grow overflow-hidden relative">
                    <div id="achievements-panel" className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'achievements' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <AchievementsPopup achievements={achievements} achievementBonuses={achievementBonuses} onClose={() => { }} />
                    </div>
                    <div id="shop-panel" className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'shop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <ShopPopup
                            quantumShards={quantumShards}
                            purchasedShopUpgrades={purchasedShopUpgrades}
                            onBuy={onBuyShopUpgrade}
                        />
                    </div>
                    <div className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'settings' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => { }} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommandCenterSection;
