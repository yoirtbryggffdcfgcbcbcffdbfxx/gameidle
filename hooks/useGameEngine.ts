import { useEffect, useMemo, useCallback, useState, useRef } from 'react';

// Hooks
import { useGameState } from './useGameState';
import { useSettings } from './useSettings';
import { usePopupManager } from './usePopupManager';
import { useParticleSystem } from './useParticleSystem';
import { useSfx } from './useSfx';
import { useFloatingText } from './useFloatingText';

// Types
import { Achievement, Notification } from '../types';

// Constants & Helpers
import { CLICK_POWER, PARTICLE_COLORS } from '../constants';
import { formatNumber } from '../utils/helpers';

/**
 * The main game engine hook.
 * Encapsulates all game logic, state management, and side effects.
 */
export const useGameEngine = () => {
    const { settings, setSettings, handleSettingsChange, appState, setAppState } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.visualEffects);
    
    // --- Unified Notification System ---
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationIdCounter = useRef(0);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        const id = notificationIdCounter.current++;
        const newNotification: Notification = {
            id,
            message,
            type,
            title: options.title,
            achievement: options.achievement,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);
    // --- End of Notification System ---

    const popups = usePopupManager();

    const handleAchievementUnlock = useCallback((achievement: Achievement) => {
        playSfx('buy');
        addNotification(achievement.description, 'achievement', {
            title: "Succès Débloqué!",
            achievement: achievement,
        });
    }, [addNotification, playSfx]);
    
    const gameState = useGameState(handleAchievementUnlock);
    const { 
        energy, 
        productionTotal, 
        prestigeCount, 
        prestigeBonuses, 
        canPrestige,
        prestigeGain,
        isLoaded,
        unlockAchievement,
    } = gameState;
    
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);
    const formattedEnergy = useMemo(() => memoizedFormatNumber(energy), [energy, memoizedFormatNumber]);
    
    // Game Loop & Save Timer Effects
    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => setAppState('menu'), 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, setAppState]);
    
    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const saveTimer = setInterval(() => gameState.saveGameState(settings), 5000);
        const productionTimer = setInterval(() => {
            if (productionTotal > 0) {
                addFloatingText(`+${memoizedFormatNumber(productionTotal)}`, window.innerWidth * 0.25, 60, '#00ffcc');
            }
        }, 1000);
        return () => {
            clearInterval(saveTimer);
            clearInterval(productionTimer);
        }
    }, [gameState, settings, isLoaded, appState, productionTotal, addFloatingText, memoizedFormatNumber]);
    
    // --- Event Handlers ---
    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const clickValue = (CLICK_POWER + prestigeCount) * prestigeBonuses.clickMultiplier;
        gameState.setEnergy(prev => Math.min(prev + clickValue, 10000));
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${memoizedFormatNumber(clickValue)}`, e.clientX, e.clientY, '#ffffff');
        unlockAchievement("Premier Clic");
    };

    const handleBuyUpgrade = (index: number) => {
        if (gameState.buyUpgrade(index)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            unlockAchievement("Premier Achat");
        } else {
            addNotification("Pas assez d'énergie !", 'error');
        }
    };
    
    const confirmPrestige = () => {
        if (gameState.doPrestige()) {
            unlockAchievement("Première Prestige");
            addNotification(`Prestige x${prestigeGain} obtenu !`, 'info', { title: "Prestige !" });
        }
        popups.setShowPrestigeConfirm(false);
    };

    const handlePrestigeAttempt = () => {
        if (!canPrestige) return;
        if (settings.confirmPrestige) {
            popups.setShowPrestigeConfirm(true);
        } else {
            confirmPrestige();
        }
    };

    const handleBuyPrestigeUpgrade = (id: string) => {
        if (gameState.buyPrestigeUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration de prestige achetée !", 'info');
        } else {
            addNotification("Pas assez de points de prestige !", 'error');
        }
    };

    const handleConfirmHardReset = () => {
        playSfx('click');
        gameState.resetGame(true);
        popups.setActivePopup(null);
        popups.setShowHardResetConfirm(false);
        addNotification("Jeu réinitialisé.", 'info');
    }
    
    const startNewGame = () => {
        gameState.resetGame(true);
        setSettings(s => ({...s, theme: s.theme}));
        popups.setShowTutorial(true);
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
        if (gameState.hasSaveData) {
            popups.setShowNewGameConfirm(true);
        } else {
            startNewGame();
        }
    };

    const handleConfirmNewGame = () => {
        playSfx('click');
        popups.setShowNewGameConfirm(false);
        startNewGame();
        addNotification("Nouvelle partie commencée.", 'info');
    };

    return {
        appState,
        hasSaveData: gameState.hasSaveData,
        playSfx,
        memoizedFormatNumber,
        removeNotification,

        // All game-related state values
        gameState: {
            energy: gameState.energy,
            upgrades: gameState.upgrades,
            achievements: gameState.achievements,
            prestigeCount: gameState.prestigeCount,
            purchasedPrestigeUpgrades: gameState.purchasedPrestigeUpgrades,
        },
        
        // Values computed from game state
        computedState: {
            canPrestige: gameState.canPrestige,
            prestigeGain: gameState.prestigeGain,
            totalUpgradesOwned: gameState.totalUpgradesOwned,
            formattedEnergy,
        },

        // UI-specific state
        uiState: {
            settings,
            particles,
            floatingTexts,
            notifications,
            activePopup: popups.activePopup,
            showTutorial: popups.showTutorial,
            showHardResetConfirm: popups.showHardResetConfirm,
            showPrestigeConfirm: popups.showPrestigeConfirm,
        },

        // Callbacks for UI components
        handlers: {
            onCollect: handleCollect,
            onBuyUpgrade: handleBuyUpgrade,
            onPrestige: handlePrestigeAttempt,
            onConfirmPrestige: confirmPrestige,
            onBuyPrestigeUpgrade: handleBuyPrestigeUpgrade,
            onConfirmHardReset: handleConfirmHardReset,
            onSettingsChange: handleSettingsChange,
            handleContinue,
            handleNewGameClick,
            handleConfirmNewGame,
        },
        
        // Functions to manage UI state
        popups,
        removeParticle,
        removeFloatingText,
    };
};
