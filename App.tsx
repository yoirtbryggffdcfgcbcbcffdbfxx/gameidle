import React from 'react';

import { useGameEngine } from './hooks/useGameEngine';
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';
import NotificationCenter from './components/Notification';
import CreditsPopup from './components/popups/CreditsPopup';
import IntroCinematic from './components/IntroCinematic';
import { GameContext } from './contexts/GameContext';

const App: React.FC = () => {
    const game = useGameEngine();

    if (game.appState === 'loading') {
        return <LoadingScreen />;
    }

    if (game.appState === 'cinematic') {
        return <IntroCinematic onComplete={game.handlers.handleStartGameAfterCinematic} />;
    }

    if (game.appState === 'menu') {
        return (
            <>
                <MainMenu
                    hasSaveData={game.hasSaveData}
                    onContinue={game.handlers.handleContinue}
                    onNewGame={game.handlers.handleNewGameClick}
                    onCreditsClick={() => game.popups.setActivePopup('credits')}
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
        <GameContext.Provider value={game}>
            <div id="game-content-wrapper" className="h-full w-full">
                <GameUI />
                 <NotificationCenter
                    notifications={game.uiState.notifications}
                    removeNotification={game.removeNotification}
                    // Responsive classes for mobile vs desktop
                    className="fixed top-4 right-4 w-44 sm:w-64 z-[2500]"
                />
            </div>
        </GameContext.Provider>
    );
};

export default App;