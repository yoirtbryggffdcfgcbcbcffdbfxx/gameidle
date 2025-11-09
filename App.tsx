import React from 'react';

import { useGameEngine } from './hooks/useGameEngine';
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';
import NotificationCenter from './components/Notification';
import CreditsPopup from './components/popups/CreditsPopup';
import IntroCinematic from './components/IntroCinematic';

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
        <div id="game-content">
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
                // FIX: Removed unused 'setActivePopup' prop which is not defined on GameUIProps.
                // FIX: Pass 'addFloatingText' prop to GameUI to satisfy its prop requirements.
                addFloatingText={game.addFloatingText}
                removeParticle={game.removeParticle}
                removeFloatingText={game.removeFloatingText}
                setTutorialStep={game.popups.setTutorialStep}
                setShowHardResetConfirm={game.popups.setShowHardResetConfirm}
                setShowAscensionConfirm={game.popups.setShowAscensionConfirm}
                setShowAscensionTutorial={game.popups.setShowAscensionTutorial}
                setShowCoreTutorial={game.setShowCoreTutorial}
                // FIX: Add missing 'setShowBankTutorial' prop to satisfy GameUIProps.
                setShowBankTutorial={game.setShowBankTutorial}
                setShowBankInfoPopup={game.setShowBankInfoPopup}
            />
             <NotificationCenter
                notifications={game.uiState.notifications}
                removeNotification={game.removeNotification}
                // Responsive classes for mobile vs desktop
                className="fixed top-4 right-4 w-56 sm:w-64 sm:bottom-4 sm:top-auto"
            />
        </div>
    );
};

export default App;