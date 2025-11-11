

import { useMemo, useCallback, useEffect, useState } from 'react';
import { Achievement, QuantumPathType } from '../types';

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
import { QUANTUM_PATHS } from '../data/quantumPaths';

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
    
    const [activeView, setActiveView] = useState<'main' | 'quantum_core' | 'quantum_path'>('main');
    const [showQuantumPathConfirm, setShowQuantumPathConfirm] = useState(false);
    const [pathChoiceToConfirm, setPathChoiceToConfirm] = useState<QuantumPathType | null>(null);

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

    // NEW: Trigger popups based on state changes from the game loop
    useEffect(() => {
        if (gameState.isShopUnlocked) {
            popups.setShowShopTutorial(true);
        }
    }, [gameState.isShopUnlocked, popups.setShowShopTutorial]);

    useEffect(() => {
        if (gameState.isCoreUnlocked && !gameState.hasSeenCoreTutorial) {
            popups.setShowCoreTutorial(true);
            actions.setHasSeenCoreTutorial(true);
        }
    }, [gameState.isCoreUnlocked, gameState.hasSeenCoreTutorial, popups.setShowCoreTutorial, actions.setHasSeenCoreTutorial]);


    // Auto-advance tutorial logic
    useEffect(() => {
        if (popups.tutorialStep === 2 && gameState.energy >= 15) {
            popups.setTutorialStep(3);
        }
    }, [gameState.energy, popups.tutorialStep, popups.setTutorialStep]);
    
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
        addParticle,
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

    // --- Quantum Core Interface Handlers ---
    const enterQuantumInterface = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        playSfx('ui_hover');
        actions.markQuantumCoreAsInteracted();
        if (gameState.chosenQuantumPath) {
            setActiveView('quantum_path');
        } else {
            setActiveView('quantum_core');
        }
    };

    const exitQuantumInterface = () => {
        playSfx('click');
        setActiveView('main');
    };
    
    const onChooseQuantumPath = (path: QuantumPathType) => {
        playSfx('click');
        setPathChoiceToConfirm(path);
        setShowQuantumPathConfirm(true);
    };

    const onConfirmQuantumPath = () => {
        if (pathChoiceToConfirm) {
            actions.setQuantumPath(pathChoiceToConfirm);
            playSfx('buy');
            addNotification(`Voie du ${QUANTUM_PATHS[pathChoiceToConfirm].name} choisie !`, 'info');
            setShowQuantumPathConfirm(false);
            setPathChoiceToConfirm(null);
            setActiveView('quantum_path'); // Switch to the new interface
        }
    };

    const onPurchasePathUpgrade = () => {
        if (actions.purchasePathUpgrade()) {
            playSfx('buy');
            addNotification("Progression de voie acquise !", 'info');
        } else {
            addNotification("Pas assez de Fragments Quantiques !", 'error');
        }
    };
    
    // FIX: Add a handler for purchasing core upgrades to be passed via context.
    const onBuyCoreUpgrade = (id: string) => {
        if (actions.buyCoreUpgrade(id)) {
            playSfx('buy');
            addNotification("Calibration du cœur acquise !", 'info');
        } else {
            addNotification("Pas assez de Fragments Quantiques ou prérequis non remplis !", 'error');
        }
    };

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
            activeView,
            showQuantumPathConfirm,
            pathChoiceToConfirm,
            ...popups,
        },
        
        // Handlers (user actions)
        handlers: {
            ...appHandlers,
            ...playerHandlers,
            ...prestigeHandlers,
            ...bankHandlers,
            ...shopHandlers,
            markShopItemsAsSeen: actions.markShopItemsAsSeen,
            onSettingsChange: handleSettingsChange,
            enterQuantumInterface,
            exitQuantumInterface,
            onChooseQuantumPath,
            onConfirmQuantumPath,
            onPurchasePathUpgrade,
            onBuyCoreUpgrade,
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
        setShowShopTutorial: popups.setShowShopTutorial,
        setShowBankInfoPopup: popups.setShowBankInfoPopup,
        setShowQuantumPathConfirm, // Expose setter
    };
};