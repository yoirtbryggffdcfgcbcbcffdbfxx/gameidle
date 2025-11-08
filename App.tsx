import React from 'react';

import { useGameEngine } from './hooks/useGameEngine';
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';
import NotificationCenter from './components/Notification';
import CreditsPopup from './components/popups/CreditsPopup';

const App: React.FC = () => {
    const game = useGameEngine();

    if (game.appState === 'loading') {
        return <LoadingScreen />;
    }

    if (game.appState === 'menu') {
        return (
            <>
                <MainMenu
                    hasSaveData={game.hasSaveData}
                    onContinue={game.handlers.handleContinue}
                    onNewGame={game.handlers.handleNewGameClick}
                    onCreditsClick={game.handlers.handleCreditsClick}
                    playSfx={game.playSfx}
                />
                <ConfirmationPopup
                    show={game.popups.showNewGameConfirm}
                    title="Commencer une nouvelle partie ?"
                    message="Votre progression actuelle sera effacée. Êtes-vous sûr de vouloir continuer ?"
                    onConfirm={game.handlers.handleConfirmNewGame}
                    onCancel={() => {
                        game.playSfx('click');
                        game.popups.setShowNewGameConfirm(false);
                    }}
                />
                {game.uiState.activePopup === 'credits' && (
                    <CreditsPopup onClose={() => game.popups.setActivePopup(null)} />
                )}
            </>
        );
    }
    
    return (
        <>
            <GameUI
                // State & Data
                {...game.gameState}
                {...game.computedState}
                {...game.uiState}
                // Callbacks & Handlers
                {...game.handlers}
                // Functions
                playSfx={game.playSfx}
                formatNumber={game.memoizedFormatNumber}
                setActivePopup={game.popups.setActivePopup}
                removeParticle={game.removeParticle}
                removeFloatingText={game.removeFloatingText}
                setTutorialStep={game.popups.setTutorialStep}
                setShowHardResetConfirm={game.popups.setShowHardResetConfirm}
                setShowAscensionConfirm={game.popups.setShowAscensionConfirm}
                setShowAscensionTutorial={game.popups.setShowAscensionTutorial}
                // FIX: Added missing 'setShowCoreTutorial' prop to satisfy GameUIProps interface.
                setShowCoreTutorial={game.setShowCoreTutorial}
            />
            <NotificationCenter 
                notifications={game.uiState.notifications} 
                removeNotification={game.removeNotification} 
            />
        </>
    );
};

export default App;