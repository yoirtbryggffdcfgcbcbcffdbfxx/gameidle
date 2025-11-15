import React from 'react';
import { useGameContext } from '../../../contexts/GameContext';
import DevPanel from '../DevPanel';

const DevPanelController: React.FC = () => {
    const { uiState, popups, handlers, computedState, gameState, memoizedFormatNumber } = useGameContext();

    if (!uiState.showDevPanel) {
        return null;
    }
    
    const { isDevModeActive, forceShowCursor } = uiState;
    const { setIsDevModeActive, setForceShowCursor } = popups;

    const addSystemMessage = () => {
        handlers.addMessage(
            `GameState Update. Energy: ${memoizedFormatNumber(gameState.energy)}`,
            'system',
            { title: 'System Log' }
        );
    };
    
    const toggleDevMode = () => {
        setIsDevModeActive(prev => !prev);
    };

    const toggleForceShowCursor = () => {
        setForceShowCursor(prev => !prev);
    };

    return (
        <DevPanel
            addEnergy={() => handlers.dev.setEnergy(computedState.displayMaxEnergy)}
            addSpecificEnergy={handlers.dev.addEnergy}
            addAscension={() => handlers.dev.addAscensionLevel(1, 10)}
            unlockAllUpgrades={handlers.dev.addLevelsToAllUpgrades}
            unlockAllAchievements={handlers.dev.unlockAllAchievements}
            resetAchievements={handlers.dev.resetAchievements}
            addSystemMessage={addSystemMessage}
            toggleDevMode={toggleDevMode}
            isDevModeActive={isDevModeActive}
            closePanel={() => popups.setShowDevPanel(false)}
            toggleForceShowCursor={toggleForceShowCursor}
            isCursorForced={forceShowCursor}
            fillCore={() => handlers.dev.setCoreCharge(100)}
            addShards={handlers.dev.addShards}
            unlockShop={() => handlers.dev.unlockFeature('shop')}
            unlockCore={() => handlers.dev.unlockFeature('core')}
            unlockBank={() => handlers.dev.unlockFeature('bank')}
        />
    );
};

export default DevPanelController;