import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import SlidingUpPanel from '../ui/SlidingUpPanel';
import AchievementsPopup from './AchievementsPopup';
import SettingsPopup from './SettingsPopup';

const MobileMenuPopup: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups, playSfx } = useGameContext();
    const { activeMobilePopup } = uiState;
    const { setActiveMobilePopup } = popups;

    const { achievements } = gameState;
    const { achievementBonuses } = computedState;
    const { settings } = uiState;
    const { onSettingsChange } = handlers;
    const { setShowHardResetConfirm } = popups;

    const titles: { [key in 'achievements' | 'settings']: string } = {
        achievements: '🏆 Succès',
        settings: '⚙️ Paramètres',
    };
    
    const currentTitle = activeMobilePopup ? titles[activeMobilePopup] : '';

    return (
        <SlidingUpPanel
            show={!!activeMobilePopup}
            onClose={() => setActiveMobilePopup(null)}
            title={currentTitle}
        >
            {activeMobilePopup === 'achievements' && (
                <AchievementsPopup achievements={achievements} achievementBonuses={achievementBonuses} onClose={() => { }} />
            )}
            {activeMobilePopup === 'settings' && (
                <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => { }} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
            )}
        </SlidingUpPanel>
    );
};

export default MobileMenuPopup;