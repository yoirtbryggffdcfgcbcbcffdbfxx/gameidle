import { useEffect, useMemo, useCallback } from 'react';

// Hooks
import { useGameState } from './useGameState';
import { useSettings } from './useSettings';
import { usePopupManager } from './usePopupManager';
import { useParticleSystem } from './useParticleSystem';
import { useNotifier } from './useNotifier';
import { useSfx } from './useSfx';
import { useFloatingText } from './useFloatingText';
import { useAchievementQueue } from './useAchievementQueue';

// Constants & Helpers
import { CLICK_POWER, PARTICLE_COLORS } from '../constants';
import { formatNumber } from '../utils/helpers';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

/**
 * The main game engine hook.
 * Encapsulates all game logic, state management, and side effects.
 */
export const useGameEngine = () => {
    const { settings, setSettings, handleSettingsChange, appState, setAppState } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { notification, showNotification } = useNotifier();
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.visualEffects);
    const { currentAchievementToast, queueAchievement } = useAchievementQueue();
    
    const popups = usePopupManager();

    const gameState = useGameState();
    const { 
        energy, 
        productionTotal, 
        prestigeCount, 
        prestigeBonuses, 
        totalUpgradesOwned, 
        canPrestige,
        prestigeGain,
        isLoaded,
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

    // Achievement Unlocking Effect
    useEffect(() => {
        if (appState !== 'game' || !isLoaded) return;
        
        const checkAndUnlock = (condition: boolean, achievementName: string) => {
            if (!condition) return;

            const achievement = gameState.achievements.find(a => a.name === achievementName);
            if (achievement && !achievement.unlocked) {
                gameState.unlockAchievement(achievementName);
                const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === achievementName);
                if (achievementData) {
                    queueAchievement(achievementData);
                }
            }
        };

        checkAndUnlock(totalUpgradesOwned >= 10, "Collectionneur");
        checkAndUnlock(totalUpgradesOwned >= 50, "Magnat");
        checkAndUnlock(totalUpgradesOwned >= 200, "Empereur Industriel");
        
        checkAndUnlock(energy >= 100, "Milliardaire en Énergie");
        checkAndUnlock(energy >= 1000, "Magnat de l'Énergie");
        checkAndUnlock(energy >= 10000, "Divinité Énergétique");

        checkAndUnlock(productionTotal >= 10, "Début de Production");
        checkAndUnlock(productionTotal >= 100, "Automatisation");
        checkAndUnlock(productionTotal >= 1000, "Puissance Industrielle");
        checkAndUnlock(productionTotal >= 10000, "Singularité Productive");
        
        checkAndUnlock(prestigeCount >= 5, "Prestigieux");
        checkAndUnlock(prestigeCount >= 25, "Légende du Prestige");

    }, [totalUpgradesOwned, energy, productionTotal, prestigeCount, gameState, queueAchievement, appState, isLoaded]);
    
    // --- Event Handlers ---
    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const clickValue = (CLICK_POWER + prestigeCount) * prestigeBonuses.clickMultiplier;
        gameState.setEnergy(prev => Math.min(prev + clickValue, 10000));
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${memoizedFormatNumber(clickValue)}`, e.clientX, e.clientY, '#ffffff');

        const achievement = gameState.achievements.find(a => a.name === "Premier Clic");
        if (achievement && !achievement.unlocked) {
            gameState.unlockAchievement("Premier Clic");
            const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === "Premier Clic");
            if (achievementData) queueAchievement(achievementData);
        }
    };

    const handleBuyUpgrade = (index: number) => {
        if (gameState.buyUpgrade(index)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            
            const achievement = gameState.achievements.find(a => a.name === "Premier Achat");
            if (achievement && !achievement.unlocked) {
                gameState.unlockAchievement("Premier Achat");
                const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === "Premier Achat");
                if (achievementData) queueAchievement(achievementData);
            }
        } else {
            showNotification("Pas assez d'énergie !", 'error', 1500);
        }
    };
    
    const confirmPrestige = () => {
        if (gameState.doPrestige()) {
            const achievement = gameState.achievements.find(a => a.name === "Première Prestige");
            if (achievement && !achievement.unlocked) {
                gameState.unlockAchievement("Première Prestige");
                const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === "Première Prestige");
                if (achievementData) queueAchievement(achievementData);
            }
            showNotification(`Prestige x${prestigeCount + prestigeGain} obtenu !`);
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
            showNotification("Amélioration de prestige achetée !");
        } else {
            showNotification("Pas assez de points de prestige !", 'error');
        }
    };

    const handleConfirmHardReset = () => {
        playSfx('click');
        gameState.resetGame(true);
        popups.setActivePopup(null);
        popups.setShowHardResetConfirm(false);
        showNotification("Jeu réinitialisé.");
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
        showNotification("Nouvelle partie commencée.");
    };

    return {
        appState,
        hasSaveData: gameState.hasSaveData,
        playSfx,
        memoizedFormatNumber,

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
            notification,
            activePopup: popups.activePopup,
            showTutorial: popups.showTutorial,
            showHardResetConfirm: popups.showHardResetConfirm,
            showPrestigeConfirm: popups.showPrestigeConfirm,
            currentAchievementToast,
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