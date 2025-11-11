import { useMemo, useCallback, useEffect, useState } from 'react';
import { Achievement } from '../types';

// Main State & Logic
import { useGameState } from './useGameState';
import { useGameLoop } from './useGameLoop';
import { useTutorialTriggers } from './useTutorialTriggers';

// App Flow & Settings
import { useAppFlow } from './useAppFlow';
import { useSettings } from './useSettings';
import { SAVE_KEY } from '../constants';

// UI & Effects
import { useSfx } from './useSfx';
import { useNotifications } from './useNotifications';
import { useParticleSystem } from './useParticleSystem';
import { useFloatingText } from './useFloatingText';
import { usePopupManager } from './usePopupManager';
import { formatNumber } from '../utils/helpers';

// Handlers (actions with side effects)
import { useAppHandlers } from './handlers/useAppHandlers';
import { usePlayerHandlers } from './handlers/usePlayerHandlers';
import { usePrestigeHandlers } from './handlers/usePrestigeHandlers';
import { useBankHandlers } from './handlers/useBankHandlers';
import { useShopHandlers } from './handlers/useShopHandlers';

export const useGameEngine = () => {
    // --- 1. Foundational Hooks (State, Settings, UI Systems) ---
    
    const { settings, setSettings, handleSettingsChange } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    
    const { notifications, addNotification, removeNotification } = useNotifications();
    const popups = usePopupManager();
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.showFloatingText);
    
    const onAchievementUnlock = useCallback((achievement: Achievement) => {
        addNotification(
            achievement.description, 
            'achievement', 
            { title: 'Succès Débloqué !', achievement }
        );
    }, [addNotification]);

    const loadStatus = localStorage.getItem(SAVE_KEY) ? 'has_save' : 'no_save';
    const { appState, setAppState, hasSaveData } = useAppFlow(loadStatus);

    const { 
        gameState, 
        setGameState, 
        computed, 
        actions, 
        dev, 
        saveGameState, 
        achievementsManager, 
        prestigeState, 
        bankState 
    } = useGameState(onAchievementUnlock, appState, loadStatus);

    // --- 2. Memoized Values & Callbacks ---

    const memoizedFormatNumber = useCallback((num: number) => {
        return formatNumber(num, settings.scientificNotation);
    }, [settings.scientificNotation]);

    const onLoanRepaid = useCallback(() => {
        addNotification("Votre prêt a été entièrement remboursé !", 'info', { title: "Prêt Remboursé" });
    }, [addNotification]);

    // --- 3. Game Loop & Event Triggers ---

    const loopLoadStatus = appState === 'loading' ? 'loading' : 'loaded';
    useGameLoop(appState, loopLoadStatus, setGameState, prestigeState, bankState, onLoanRepaid);
    
    useEffect(() => {
        if (appState === 'game') {
            achievementsManager.checkAll(gameState, computed.productionTotal, computed.maxEnergy);
        }
    }, [gameState, computed.productionTotal, computed.maxEnergy, appState, achievementsManager]);
    
    useTutorialTriggers(
        gameState,
        prestigeState,
        setGameState,
        () => popups.setShowAscensionTutorial(true),
        () => popups.setShowBankTutorial(true)
    );
    
    // --- 4. Auto-save Logic ---
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (appState === 'game') {
                saveGameState(settings);
                addNotification("Progression sauvegardée.", 'info', { title: 'Sauvegarde auto' });
            }
        }, 60000); // Save every 60 seconds
        return () => clearInterval(autoSaveInterval);
    }, [appState, saveGameState, settings, addNotification]);
    
    // --- 5. Handlers (User Actions with Side-Effects) ---
    
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
        setShowCoreTutorial: popups.setShowCoreTutorial,
    });

    const bankHandlers = useBankHandlers({
        computed,
        actions,
        playSfx,
        addNotification,
        memoizedFormatNumber,
        gameState,
    });

    const shopHandlers = useShopHandlers({
        gameState,
        actions,
        playSfx,
        addNotification,
    });
    
    // --- 6. Dev Tools ---
    const [showDevPanel, setShowDevPanel] = useState(false);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
                e.preventDefault();
                setShowDevPanel(prev => {
                    const newState = !prev;
                    if (newState) {
                        actions.unlockAchievement("Développeur Honoraire");
                    }
                    return newState;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [actions]);

    // --- 7. Aggregated Return Object for Context ---
    
    return {
        // State
        appState,
        hasSaveData,
        gameState,
        computedState: computed, // Renamed for clarity in context
        
        // UI State
        uiState: {
            settings,
            notifications,
            particles,
            floatingTexts,
            showDevPanel,
            ...popups,
        },
        
        // Handlers (user actions)
        handlers: {
            ...appHandlers,
            ...playerHandlers,
            ...prestigeHandlers,
            ...bankHandlers,
            ...shopHandlers,
            onSettingsChange: handleSettingsChange,
            dev, // Expose dev actions
        },
        
        // Utilities & Callbacks for components
        playSfx,
        popups,
        removeNotification,
        removeParticle,
        removeFloatingText,
        memoizedFormatNumber,
        setShowDevPanel,
        setShowCoreTutorial: popups.setShowCoreTutorial,
        setShowBankTutorial: popups.setShowBankTutorial,
        setShowBankInfoPopup: popups.setShowBankInfoPopup,
    };
};