import React, { useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';
import CreditsPopup from './components/popups/CreditsPopup';
import IntroCinematic from './components/IntroCinematic';
import ToastManager from './components/messages/ToastManager';
// Imports des nouveaux contextes
import { GameDataContext } from './contexts/GameDataContext';
import { GameActionContext } from './contexts/GameActionContext';

interface LegacyAppProps {
    onBackToLauncher?: () => void;
}

const LegacyApp: React.FC<LegacyAppProps> = ({ onBackToLauncher }) => {
    // useGameEngine retourne maintenant { gameData, gameActions, ... }
    const { gameData, gameActions } = useGameEngine();

    // Tenter de récupérer le focus clavier immédiatement au chargement
    useEffect(() => {
        const grabFocus = () => {
            if (document.activeElement !== document.body) {
                window.focus();
                document.body.focus();
            }
        };

        grabFocus();

        const handleClick = () => grabFocus();
        window.addEventListener('click', handleClick);
        
        const timer = setTimeout(grabFocus, 500);

        return () => {
            window.removeEventListener('click', handleClick);
            clearTimeout(timer);
        };
    }, []);

    // Reconstruction des props pour le menu et les popups qui sont en dehors du GameUI pour l'instant
    const game = { ...gameData, ...gameActions };

    return (
        <GameDataContext.Provider value={gameData}>
            <GameActionContext.Provider value={gameActions}>
            
                {game.appState === 'loading' && <LoadingScreen />}

                {game.appState === 'cinematic' && (
                    <IntroCinematic onComplete={game.handlers.handleStartGameAfterCinematic} />
                )}

                {game.appState === 'menu' && (
                    <>
                        <MainMenu
                            hasSaveData={game.hasSaveData}
                            onContinue={game.handlers.handleContinue}
                            onNewGame={game.handlers.handleNewGameClick}
                            onCreditsClick={() => game.popups.setActivePopup('credits')}
                            playSfx={game.playSfx}
                        />
                        {/* Bouton de retour au launcher discret */}
                        {onBackToLauncher && (
                            <button 
                                onClick={onBackToLauncher}
                                className="fixed top-2 left-2 z-[9999] text-[10px] text-gray-700 hover:text-gray-500 font-mono opacity-50 hover:opacity-100 transition-all"
                            >
                                [EXIT_TO_BOOTLOADER]
                            </button>
                        )}

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
                )}
                
                {game.appState === 'game' && (
                    <div id="game-content-wrapper" className="h-full w-full">
                        <GameUI />
                    </div>
                )}

                {/* Global Toast Manager */}
                {game.appState !== 'loading' && <ToastManager />}
            
            </GameActionContext.Provider>
        </GameDataContext.Provider>
    );
};

export default LegacyApp;