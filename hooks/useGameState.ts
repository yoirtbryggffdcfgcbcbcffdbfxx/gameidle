// hooks/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { GameState, Achievement, Settings, Notification } from '../types';
import { SAVE_KEY, MAX_UPGRADE_LEVEL } from '../constants';
import { getInitialState } from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

import { usePlayerState } from './state/usePlayerState';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { useShopState } from './state/useShopState';
import { useAchievements } from './state/useAchievements';
import { useQuantumCoreState } from './state/useQuantumCoreState';
import { useCoreMechanics } from './state/useCoreMechanics';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../data/shop';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../data/core';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../data/bank';

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
                    isBankDiscovered: loadedData.isBankDiscovered || false,
                    hasUnseenShopItems: loadedData.hasUnseenShopItems || false,
                    chosenQuantumPath: loadedData.chosenQuantumPath || null,
                    quantumPathLevel: loadedData.quantumPathLevel || 0,
                    hasInteractedWithQuantumCore: loadedData.hasInteractedWithQuantumCore || false,
                    loanTier: loadedData.loanTier || 0,
                    timePlayedInSeconds: loadedData.timePlayedInSeconds || 0,
                    messageLog: loadedData.messageLog || [],
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
    
    // --- Message Center Actions ---
    const addMessage = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        setGameState(prev => {
            const newMessage: Notification = {
                id: uuidv4(),
                timestamp: Date.now(),
                read: false,
                message,
                type,
                title: options.title,
                achievement: options.achievement
            };
            // Add to the beginning of the array and cap the log size
            const newMessageLog = [newMessage, ...prev.messageLog].slice(0, 100);
            return { ...prev, messageLog: newMessageLog };
        });
    }, [setGameState]);

    const markAllMessagesAsRead = useCallback(() => {
        setGameState(prev => {
            if (prev.messageLog.every(m => m.read)) return prev; // No changes needed
            const newLog = prev.messageLog.map(m => ({ ...m, read: true }));
            return { ...prev, messageLog: newLog };
        });
    }, [setGameState]);


    // --- State Management Hooks ---
    const achievementsManager = useAchievements(setGameState, onAchievementUnlock);
    const playerState = usePlayerState(setGameState, achievementsManager.checkAchievement);
    const prestigeState = usePrestigeState(setGameState, achievementsManager.checkAchievement, playerState.actions.resetViewedCategories);
    const coreMechanics = useCoreMechanics(setGameState);
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
    const dev_addLevelsToAllUpgrades = (levels: number) => {
        setGameState(prev => {
            const newUpgrades = prev.upgrades.map(u => {
                const isVisible = u.unlockCost <= prev.totalEnergyProduced || u.owned > 0;
                if (isVisible) {
                    return { ...u, owned: Math.min(u.owned + levels, MAX_UPGRADE_LEVEL) };
                }
                return u;
            });
            return { ...prev, upgrades: newUpgrades };
        });
    };
    const dev_setCoreCharge = (amount: number) => {
        setGameState(prev => ({ ...prev, coreCharge: Math.min(amount, 100) }));
    };
    const dev_addShards = (amount: number) => {
        setGameState(prev => ({ ...prev, quantumShards: prev.quantumShards + amount }));
    };
    const dev_unlockFeature = (feature: 'shop' | 'core' | 'bank') => {
        setGameState(prev => {
            switch (feature) {
                case 'shop':
                    return { ...prev, isShopUnlocked: true, hasUnseenShopItems: true };
                case 'core':
                    return { ...prev, isCoreUnlocked: true };
                case 'bank':
                    return { ...prev, isBankUnlocked: true, isBankDiscovered: true };
                default:
                    return prev;
            }
        });
    };
    const dev_addAscensionLevel = (levels: number, points: number) => {
        setGameState(prev => ({
            ...prev,
            ascensionLevel: prev.ascensionLevel + levels,
            ascensionPoints: prev.ascensionPoints + points,
        }));
    };
    
    // --- Computed Values Aggregation ---
    const playerComputed = playerState.getComputed(gameState);
    const prestigeComputed = prestigeState.getComputed(gameState);
    const coreComputed = coreMechanics.getComputed(gameState);
    const bankComputed = bankState.getComputed(gameState);
    
    const avgProductionLast10s = (() => {
        if (gameState.productionHistory.length === 0) return 0;
        const totalProduction = gameState.productionHistory.reduce((sum, p) => sum + p.value, 0);
        const totalDuration = gameState.productionHistory.reduce((sum, p) => sum + p.duration, 0);
        return totalDuration > 0 ? (totalProduction / totalDuration) * 1000 : 0;
    })();

    const computedValues = {
        ...playerComputed,
        ...prestigeComputed,
        ...coreComputed,
        ...bankComputed,
        clickPower: (
            (1 + playerComputed.clickPowerFromUpgrades + gameState.ascensionLevel) *
            prestigeComputed.ascensionBonuses.clickMultiplier *
            prestigeComputed.achievementBonuses.click
        ),
        avgProductionLast10s,
        displayMaxEnergy: (() => {
            if (!gameState.isShopUnlocked) {
                return SHOP_UNLOCK_TOTAL_ENERGY;
            }
            if (!gameState.isCoreUnlocked) {
                return CORE_UNLOCK_TOTAL_ENERGY;
            }
            if (!gameState.isBankUnlocked) {
                return BANK_UNLOCK_TOTAL_ENERGY;
            }
            return prestigeComputed.maxEnergy;
        })(),
    };

    return {
        gameState,
        setGameState,
        computed: computedValues,
        actions: {
            ...playerState.actions,
            ...prestigeState.actions,
            ...coreMechanics.actions,
            ...bankState.actions,
            ...shopState.actions,
            ...quantumCoreState.actions,
            unlockAchievement: achievementsManager.unlockAchievement,
            resetGame,
            addMessage,
            markAllMessagesAsRead,
        },
        dev: {
            setEnergy: dev_setEnergy,
            addEnergy: dev_addEnergy,
            unlockAllAchievements: achievementsManager.dev_unlockAll,
            resetAchievements: achievementsManager.dev_reset,
            doAscension: prestigeState.actions.doAscension,
            addLevelsToAllUpgrades: dev_addLevelsToAllUpgrades,
            setCoreCharge: dev_setCoreCharge,
            addShards: dev_addShards,
            unlockFeature: dev_unlockFeature,
            addAscensionLevel: dev_addAscensionLevel,
        },
        saveGameState,
        // Expose sub-state managers for the orchestrator
        achievementsManager,
        prestigeState,
        coreMechanics,
        bankState,
    };
};