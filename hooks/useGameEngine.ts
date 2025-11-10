// hooks/useGameEngine.ts
import React, { useEffect, useMemo, useCallback, useState } from 'react';

// Hooks
import { useGameState } from './useGameState';
import { useSettings } from './useSettings';
import { usePopupManager } from './usePopupManager';
import { useParticleSystem } from './useParticleSystem';
import { useSfx } from './useSfx';
import { useFloatingText } from './useFloatingText';
import { useNotifications } from './useNotifications';
// import { useAppFlow } from './useAppFlow'; // No longer needed here
import { useGameHandlers } from './useGameHandlers'; // New hook for game actions

// Types
import { Achievement } from '../types';

// Constants & Helpers
import { formatNumber } from '../utils/helpers';

export const useGameEngine = () => {
    // --- Core State & Systems ---
    const { settings, setSettings, handleSettingsChange } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.showFloatingText);
    const { notifications, addNotification, removeNotification } = useNotifications();
    
    // --- Popups & UI State ---
    const popups = usePopupManager();
    const [showDevPanel, setShowDevPanel] = useState(false);
    const [showCoreTutorial, setShowCoreTutorial] = useState(false);
    const [showBankTutorial, setShowBankTutorial] = useState(false);

    // --- Callbacks for GameState ---
    const handleAchievementUnlock = useCallback((achievement: Achievement) => {
        playSfx('buy');
        addNotification(achievement.description, 'achievement', {
            title: "Succès Débloqué!",
            achievement: achievement,
        });
    }, [addNotification, playSfx]);
    
    const handleShowAscensionTutorial = useCallback(() => {
        popups.setShowAscensionTutorial(true);
    }, [popups]);
    
    const handleLoanRepaid = useCallback(() => {
        addNotification("Votre prêt a été entièrement remboursé !", 'info', { title: "Prêt Remboursé" });
    }, [addNotification]);
    
    const handleBankUnlockedFirstTime = useCallback(() => {
        setShowBankTutorial(true);
    }, []);

    // FIX: The useAppFlow logic has been moved inside useGameState to break a circular dependency.
    // We now get appState, setAppState, and hasSaveData directly from useGameState.
    const { gameState, computed, actions, dev, loadStatus, saveGameState, appState, setAppState, hasSaveData } = useGameState(handleAchievementUnlock, handleShowAscensionTutorial, handleLoanRepaid, handleBankUnlockedFirstTime);
    
    // --- Derived State & Memoization ---
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);
    const formattedEnergy = useMemo(() => memoizedFormatNumber(gameState.energy), [gameState.energy, memoizedFormatNumber]);
    
    // --- Game Handlers ---
    const handlers = useGameHandlers({
        gameState,
        computed,
        actions,
        dev,
        settings,
        popups,
        playSfx,
        addParticle,
        addFloatingText,
        addNotification,
        setAppState,
        setSettings,
        hasSaveData,
        unlockAudio,
        setShowCoreTutorial,
    });

    // --- Effects ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                setShowDevPanel(prev => !prev);
                if(!showDevPanel) actions.unlockAchievement("Développeur Honoraire");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDevPanel, actions]);

    useEffect(() => {
        if (loadStatus === 'loading' || appState !== 'game') return;
        const saveTimer = setInterval(() => saveGameState(settings), 5000);
        return () => clearInterval(saveTimer);
    }, [saveGameState, settings, loadStatus, appState]);
    

    return {
        appState,
        hasSaveData,
        playSfx,
        memoizedFormatNumber,
        removeNotification,

        gameState,
        computedState: { ...computed, formattedEnergy },

        uiState: {
            settings,
            particles,
            floatingTexts,
            notifications,
            activePopup: popups.activePopup,
            tutorialStep: popups.tutorialStep,
            showHardResetConfirm: popups.showHardResetConfirm,
            showAscensionConfirm: popups.showAscensionConfirm,
            showAscensionTutorial: popups.showAscensionTutorial,
            showDevPanel,
            showCoreTutorial,
            showBankTutorial,
            showBankInfoPopup: popups.showBankInfoPopup,
        },

        handlers,
        
        popups,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowBankInfoPopup: popups.setShowBankInfoPopup,
        removeParticle,
        removeFloatingText,
        addFloatingText,
        setShowDevPanel,
    };
};