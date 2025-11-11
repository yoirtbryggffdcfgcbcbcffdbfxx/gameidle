// hooks/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { GameState, Achievement, Settings } from '../types';
import { SAVE_KEY, TICK_RATE } from '../constants';
import { getInitialState } from '../utils/helpers';

import { usePlayerState } from './state/usePlayerState';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { useShopState } from './state/useShopState';
import { useAchievements } from './state/useAchievements';
import { useQuantumCoreState } from './state/useQuantumCoreState';

export const useGameState = (
    onAchievementUnlock: (achievement: Achievement) => void,
    appState: string,
    loadStatus: string,
) => {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    
    // Load game state from local storage on mount
    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                const loadedData = JSON.parse(savedGame);
                const initialState = getInitialState();
                const mergedState: GameState = {
                    ...initialState,
                    ...loadedData,
                    purchasedAscensionUpgrades: [...new Set(['start', ...(loadedData.purchasedAscensionUpgrades || [])])],
                    // FIX: Ensure purchasedCoreUpgrades from save data is loaded correctly.
                    purchasedCoreUpgrades: [...new Set(['core_start', ...(loadedData.purchasedCoreUpgrades || [])])],
                    achievements: initialState.achievements.map(initialAch => {
                        const savedAch = loadedData.achievements?.find((sa: Achievement) => sa.name === initialAch.name);
                        return { ...initialAch, ...(savedAch || {}) };
                    }),
                    seenUpgrades: loadedData.seenUpgrades || [],
                    viewedCategories: loadedData.viewedCategories || [],
                    isShopUnlocked: loadedData.isShopUnlocked || false,
                    isCoreUnlocked: loadedData.isCoreUnlocked || false,
                    hasUnseenShopItems: loadedData.hasUnseenShopItems || false,
                    chosenQuantumPath: loadedData.chosenQuantumPath || null,
                    quantumPathLevel: loadedData.quantumPathLevel || 0,
                    hasInteractedWithQuantumCore: loadedData.hasInteractedWithQuantumCore || false,
                };
                setGameState(mergedState);
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
            setGameState(getInitialState());
        }
    }, []);

    const saveGameState = useCallback((settings: Settings) => {
        try {
            const stateToSave = { ...gameState, settings };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save game state:", error);
        }
    }, [gameState]);
    
    // --- State Management Hooks ---
    const achievementsManager = useAchievements(setGameState, onAchievementUnlock);
    const playerState = usePlayerState(setGameState, achievementsManager.checkAchievement);
    const prestigeState = usePrestigeState(setGameState, achievementsManager.checkAchievement, playerState.actions.resetViewedCategories);
    const bankState = useBankState(setGameState, achievementsManager.unlockAchievement);
    const shopState = useShopState(setGameState);
    const quantumCoreState = useQuantumCoreState(setGameState, achievementsManager.checkAchievement);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
        }
        setGameState(getInitialState());
    }, []);

    // --- Dev Functions ---
    const dev_setEnergy = (amount: number) => setGameState(prev => ({ ...prev, energy: amount, totalEnergyProduced: Math.max(prev.totalEnergyProduced, amount)}));
    const dev_addEnergy = (amount: number) => setGameState(prev => ({ ...prev, energy: prev.energy + amount, totalEnergyProduced: prev.totalEnergyProduced + amount }));
    
    // --- Computed Values Aggregation ---
    const playerComputed = playerState.getComputed(gameState);
    const prestigeComputed = prestigeState.getComputed(gameState);
    const bankComputed = bankState.getComputed(gameState);
    
    const avgProductionLast10s = (() => {
        if (gameState.productionHistory.length === 0) return 0;
        const sum = gameState.productionHistory.reduce((a, b) => a + b, 0);
        const avgPerTick = sum / gameState.productionHistory.length;
        return avgPerTick * (1000 / TICK_RATE); // Convert back to per-second
    })();

    const computedValues = {
        ...playerComputed,
        ...prestigeComputed,
        ...bankComputed,
        clickPower: (
            (1 + playerComputed.clickPowerFromUpgrades + gameState.ascensionLevel) *
            prestigeComputed.ascensionBonuses.clickMultiplier *
            prestigeComputed.achievementBonuses.click
        ),
        avgProductionLast10s,
    };

    return {
        gameState,
        setGameState,
        computed: computedValues,
        actions: {
            ...playerState.actions,
            ...prestigeState.actions,
            ...bankState.actions,
            ...shopState.actions,
            ...quantumCoreState.actions,
            unlockAchievement: achievementsManager.unlockAchievement,
            resetGame,
        },
        dev: {
            setEnergy: dev_setEnergy,
            addEnergy: dev_addEnergy,
            unlockAllAchievements: achievementsManager.dev_unlockAll,
            resetAchievements: achievementsManager.dev_reset,
            doAscension: prestigeState.actions.doAscension,
        },
        saveGameState,
        // Expose sub-state managers for the orchestrator
        achievementsManager,
        prestigeState,
        bankState,
    };
};