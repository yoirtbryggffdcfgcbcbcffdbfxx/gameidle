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
import { useAppFlow } from './useAppFlow';
import { useGameLoop } from './useGameLoop';
import { useTutorialTriggers } from './useTutorialTriggers';
// New Handler Hooks
import { useAppHandlers } from './handlers/useAppHandlers';
import { usePlayerHandlers } from './handlers/usePlayerHandlers';
import { usePrestigeHandlers } from './handlers/usePrestigeHandlers';
import { useBankHandlers } from './handlers/useBankHandlers';
import { useShopHandlers } from './handlers/useShopHandlers';


// Types
import { Achievement } from '../types';

// Constants & Helpers
import { formatNumber } from '../utils/helpers';
import { SAVE_KEY } from '../constants';

export const useGameEngine = () => {
    // --- App Flow & Load Status ---
    const [loadStatus, setLoadStatus] = useState<'loading' | 'no_save' | 'has_save'>('loading');
    const { appState, setAppState, hasSaveData } = useAppFlow(loadStatus);

    useEffect(() => {
        const savedGame = localStorage.getItem(SAVE_KEY);
        setLoadStatus(savedGame ? 'has_save' : 'no_save');
    }, []);

    // --- Core UI & Feedback Systems ---
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

    // --- Callbacks for Inter-System Communication ---
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

    // --- Core State Manager ---
    const { 
        gameState, 
        setGameState,
        computed, 
        actions, 
        dev, 
        saveGameState,
        achievementsManager,
        prestigeState,
        bankState,
    } = useGameState(handleAchievementUnlock, appState, loadStatus);
    
    // --- Orchestrated Side Effects / Processes ---
    useGameLoop(appState, loadStatus, setGameState, prestigeState, bankState, handleLoanRepaid);
    useTutorialTriggers(gameState, prestigeState, setGameState, handleShowAscensionTutorial, handleBankUnlockedFirstTime);

    // Achievement Checks (now orchestrated by the engine)
    useEffect(() => {
        if (appState !== 'game' || loadStatus === 'loading') return;
        const currentProdTotal = prestigeState.productionTotal(gameState);
        const currentMaxEnergy = prestigeState.maxEnergy(gameState);
        achievementsManager.checkAll(gameState, currentProdTotal, currentMaxEnergy);
    }, [gameState, appState, loadStatus, achievementsManager, prestigeState]);

    // Autosave (now orchestrated by the engine)
    useEffect(() => {
        if (loadStatus === 'loading' || appState !== 'game') return;
        const saveTimer = setInterval(() => saveGameState(settings), 5000);
        return () => clearInterval(saveTimer);
    }, [saveGameState, settings, loadStatus, appState]);


    // --- Derived State & Memoization ---
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);
    const formattedEnergy = useMemo(() => memoizedFormatNumber(gameState.energy), [gameState.energy, memoizedFormatNumber]);
    
    // --- Game Handlers ---
    const appHandlers = useAppHandlers({
        hasSaveData,
        actions,
        popups,
        playSfx,
        addNotification,
        setAppState,
        setSettings,
        unlockAudio,
    });

    const playerHandlers = usePlayerHandlers({
        gameState,
        computed,
        actions,
        settings,
        popups,
        playSfx,
        addParticle,
        addFloatingText,
        addNotification,
    });

    const prestigeHandlers = usePrestigeHandlers({
        gameState,
        computed,
        actions,
        settings,
        popups,
        playSfx,
        addNotification,
        setShowCoreTutorial,
    });

    const bankHandlers = useBankHandlers({
        computed,
        actions,
        playSfx,
        addNotification,
        memoizedFormatNumber,
    });

    const shopHandlers = useShopHandlers({
        actions,
        playSfx,
        addNotification,
    });
    
    const handlers = {
        ...appHandlers,
        ...playerHandlers,
        ...prestigeHandlers,
        ...bankHandlers,
        ...shopHandlers,
        onSettingsChange: handleSettingsChange,
        dev,
    };

    // --- Global Effects ---
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
    
    // Tutorial progression logic
    useEffect(() => {
        if (appState !== 'game') return;
        const firstUpgradeCost = gameState.upgrades.find(u => u.id === 'gen_1')?.baseCost || 10;
        if (popups.tutorialStep === 2 && gameState.energy >= firstUpgradeCost) {
            popups.setTutorialStep(3); 
        }
    }, [appState, gameState.energy, gameState.upgrades, popups.tutorialStep, popups.setTutorialStep]);


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