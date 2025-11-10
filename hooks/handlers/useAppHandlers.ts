import React from 'react';
import { Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';

type AppHandlersProps = {
    hasSaveData: boolean;
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    unlockAudio: () => void;
};

export const useAppHandlers = ({
    hasSaveData,
    actions,
    popups,
    playSfx,
    addNotification,
    setAppState,
    setSettings,
    unlockAudio,
}: AppHandlersProps) => {
    
    const startNewGame = () => {
        actions.resetGame(true);
        // Re-apply theme in case it was changed in a previous session
        setSettings(s => ({...s, theme: s.theme})); 
        popups.setTutorialStep(1);
        setAppState('game');
    };

    const handleContinue = () => {
        playSfx('click');
        unlockAudio();
        setAppState('game');
    };

    const handleNewGameClick = () => {
        playSfx('click');
        unlockAudio();
        if (hasSaveData) {
            popups.setShowNewGameConfirm(true);
        } else {
            setAppState('cinematic');
        }
    };
    
    const handleStartGameAfterCinematic = () => {
        startNewGame();
    };
    
    const handleCreditsClick = () => {
        playSfx('ui_hover');
        popups.setActivePopup('credits');
        actions.unlockAchievement("Curieux");
    };

    const handleConfirmNewGame = () => {
        playSfx('click');
        popups.setShowNewGameConfirm(false);
        setAppState('cinematic');
    };

    const onConfirmHardReset = () => {
        playSfx('click');
        actions.resetGame(true);
        popups.setShowHardResetConfirm(false);
        addNotification("Jeu réinitialisé.", 'info');
        setAppState('menu'); // Go back to menu after reset
    };

    return {
        handleContinue,
        handleNewGameClick,
        handleConfirmNewGame,
        handleCreditsClick,
        handleStartGameAfterCinematic,
        onConfirmHardReset,
    };
};
