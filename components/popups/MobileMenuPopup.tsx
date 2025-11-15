import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import SlidingUpPanel from '../ui/SlidingUpPanel';
import AchievementsPopup from './AchievementsPopup';
import ShopPopup from './ShopPopup';
import SettingsPopup from './SettingsPopup';
import { getNextFragmentCost } from '../../data/quantumFragments';
import ColoredAwardIcon from '../ui/ColoredAwardIcon';
import ColoredSettingsIcon from '../ui/ColoredSettingsIcon';

const MobileMenuPopup: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups, playSfx, memoizedFormatNumber } = useGameContext();
    const { activeMobilePopup } = uiState;
    const { setActiveMobilePopup } = popups;

    const { energy, quantumShards, achievements, purchasedShopUpgrades, isShopUnlocked, hasUnseenShopItems, isCoreUnlocked } = gameState;
    const { achievementBonuses } = computedState;
    const { settings } = uiState;
    const { onBuyShopUpgrade, onSettingsChange, markShopItemsAsSeen, onBuyQuantumShard } = handlers;
    const { setShowHardResetConfirm } = popups;

    const canAffordFragment = React.useMemo(() => isCoreUnlocked && energy >= getNextFragmentCost(quantumShards), [isCoreUnlocked, energy, quantumShards]);

    const titles = {
        achievements: <><ColoredAwardIcon className="w-6 h-6" /> Succès</>,
        shop: '🛍️ Boutique',
        settings: <><ColoredSettingsIcon className="w-6 h-6" /> Paramètres</>,
    };
    
    const currentTitle = activeMobilePopup ? titles[activeMobilePopup as keyof typeof titles] : '';

    return (
        <SlidingUpPanel
            show={!!activeMobilePopup}
            onClose={() => setActiveMobilePopup(null)}
            title={currentTitle}
        >
            {activeMobilePopup === 'achievements' && (
                <AchievementsPopup achievements={achievements} achievementBonuses={achievementBonuses} onClose={() => { }} />
            )}
            {activeMobilePopup === 'shop' && isShopUnlocked && (
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
            {activeMobilePopup === 'settings' && (
                <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => { }} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
            )}
        </SlidingUpPanel>
    );
};

export default MobileMenuPopup;
