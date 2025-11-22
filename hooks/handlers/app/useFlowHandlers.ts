
import React from 'react';
import { Settings, Notification, Achievement } from '../../../types';
import { useGameState } from '../../useGameState';
import { usePopupManager } from '../../usePopupManager';
import { ACHIEVEMENT_IDS } from '../../../constants/achievements';

type FlowHandlersProps = {
    hasSaveData: boolean;
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    unlockAudio: () => void;
};

export const useFlowHandlers = ({
    hasSaveData,
    actions,
    popups,
    playSfx,
    addMessage,
    setAppState,
    setSettings,
    unlockAudio
}: FlowHandlersProps) => {

    // Transition vers le jeu après la cinématique
    const handleStartGameAfterCinematic = () => {
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
            // Pas de sauvegarde, on lance directement le setup nouvelle partie
            handleConfirmNewGame();
        }
    };
    
    const handleCreditsClick = () => {
        playSfx('ui_hover');
        popups.setActivePopup('credits');
        actions.unlockAchievement(ACHIEVEMENT_IDS.CURIOUS);
    };

    // Setup Nouvelle Partie Locale
    const handleConfirmNewGame = () => {
        playSfx('click');
        
        // 1. Reset complet des données
        actions.resetGame(true);
        
        // 2. Reset partiel des settings (garder le thème)
        setSettings(s => ({...s, theme: s.theme})); 
        
        // 3. Activation du Tuto
        popups.setTutorialStep(1);
        
        // 4. Fermeture popup et lancement Cinématique
        popups.setShowNewGameConfirm(false);
        setAppState('cinematic');
    };

    const onConfirmHardReset = () => {
        playSfx('click');
        actions.resetGame(true);
        popups.setShowHardResetConfirm(false);
        addMessage("Jeu réinitialisé.", 'info');
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
