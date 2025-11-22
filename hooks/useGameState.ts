
// hooks/useGameState.ts
import { useState, useCallback } from 'react';
import { GameState, Achievement, Settings, Notification } from '../types';
import { getInitialState } from '../utils/helpers';
import { loadAndMergeState, saveToStorage, clearStorage } from '../utils/storage';

// Domain Hooks
import { usePlayerState } from './state/usePlayerState';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { useShopState } from './state/useShopState';
import { useAchievements } from './state/useAchievements';
import { useQuantumCoreState } from './state/useQuantumCoreState';
import { useCoreMechanics } from './state/useCoreMechanics';
import { useMessageState } from './state/useMessageState'; // New import
import { useDevTools } from './useDevTools'; // New import

// Constants for Computed Values
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../data/shop';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../data/core';
import { BANK_UNLOCK_TOTAL_ENERGY, LOAN_REPAYMENT_RATE } from '../data/bank';

export const useGameState = (
    onAchievementUnlock: (achievement: Achievement) => void,
    appState: string,
    loadStatus: string,
) => {
    // Initialization via extracted utility
    const [gameState, setGameState] = useState<GameState>(() => loadAndMergeState());
    
    const saveGameState = useCallback((settings: Settings) => {
        saveToStorage(gameState, settings);
    }, [gameState]);
    
    // --- Domain States Initialization ---
    const messageState = useMessageState(setGameState);
    const achievementsManager = useAchievements(setGameState, onAchievementUnlock);
    const playerState = usePlayerState(setGameState, achievementsManager.checkAchievement);
    const prestigeState = usePrestigeState(setGameState, achievementsManager.checkAchievement, playerState.actions.resetViewedCategories);
    const coreMechanics = useCoreMechanics(setGameState);
    const bankState = useBankState(setGameState, achievementsManager.unlockAchievement);
    const shopState = useShopState(setGameState);
    const quantumCoreState = useQuantumCoreState(setGameState, achievementsManager.checkAchievement);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            clearStorage();
        }
        setGameState(getInitialState());
    }, []);

    // Action pour charger une sauvegarde complète sans recharger la page
    const loadSave = useCallback((newState: GameState) => {
        setGameState(newState);
    }, []);

    // --- Dev Tools Initialization ---
    const devTools = useDevTools({
        setGameState, 
        achievementsManager, 
        prestigeActions: prestigeState.actions
    });

    // --- Computed Values Aggregation ---
    // Ideally this could be extracted to `useGameCalculations`, but kept here for now as glue code
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

    const netProduction = (gameState.currentLoan && gameState.currentLoan.remaining > 0)
        ? prestigeComputed.productionTotal * (1 - LOAN_REPAYMENT_RATE)
        : prestigeComputed.productionTotal;

    const computedValues = {
        ...playerComputed,
        ...prestigeComputed,
        ...coreComputed,
        ...bankComputed,
        productionTotal: prestigeComputed.productionTotal,
        netProduction,
        clickPower: (
            (1 + playerComputed.clickPowerFromUpgrades + gameState.ascensionLevel) *
            prestigeComputed.ascensionBonuses.clickMultiplier *
            prestigeComputed.achievementBonuses.click
        ),
        avgProductionLast10s,
        displayMaxEnergy: (() => {
            if (!gameState.isShopUnlocked) return SHOP_UNLOCK_TOTAL_ENERGY;
            if (!gameState.isCoreUnlocked) return CORE_UNLOCK_TOTAL_ENERGY;
            if (!gameState.isBankDiscovered) return BANK_UNLOCK_TOTAL_ENERGY;
            return Number.MAX_VALUE;
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
            ...messageState.actions,
            unlockAchievement: achievementsManager.unlockAchievement,
            resetGame,
            loadSave, // Expose loadSave
        },
        dev: devTools,
        saveGameState,
        achievementsManager,
        prestigeState,
        coreMechanics,
        bankState,
    };
};
