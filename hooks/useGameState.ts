// hooks/useGameState.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { GameState, Achievement, Settings } from '../types';
// FIX: Import missing constants to resolve reference errors.
import { SAVE_KEY, TICK_RATE, LOAN_REPAYMENT_RATE, BANK_UNLOCK_TOTAL_ENERGY, MAX_UPGRADE_LEVEL } from '../constants';
import { getInitialState } from '../utils/helpers';

import { usePlayerState } from './state/usePlayerState';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { useShopState } from './state/useShopState';
import { useAchievements } from './state/useAchievements';

export const useGameState = (
    onAchievementUnlock: (achievement: Achievement) => void,
    onCanAscendFirstTime: () => void,
    onLoanRepaid: () => void,
    onBankUnlockedFirstTime: () => void,
    appState: string
) => {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    const [loadStatus, setLoadStatus] = useState<'loading' | 'no_save' | 'has_save'>('loading');

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
                    purchasedCoreUpgrades: [...new Set(['core_start', ...(loadedData.purchasedCoreUpgrades || [])])],
                    achievements: initialState.achievements.map(initialAch => {
                        const savedAch = loadedData.achievements?.find((sa: Achievement) => sa.name === initialAch.name);
                        return { ...initialAch, ...(savedAch || {}) };
                    }),
                };
                setGameState(mergedState);
                setLoadStatus('has_save');
            } else {
                setLoadStatus('no_save');
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
            setGameState(getInitialState());
            setLoadStatus('no_save');
        }
    }, []);

    const saveGameState = useCallback((settings: Settings) => {
        try {
            const stateToSave = { ...gameState, settings };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
            if (loadStatus !== 'has_save') {
                setLoadStatus('has_save');
            }
        } catch (error) {
            console.error("Failed to save game state:", error);
        }
    }, [gameState, loadStatus]);

    const achievementsManager = useAchievements(setGameState, onAchievementUnlock);
    
    const playerState = usePlayerState(setGameState, achievementsManager.checkAchievement);
    const prestigeState = usePrestigeState(setGameState, achievementsManager.checkAchievement);
    const bankState = useBankState(setGameState, onLoanRepaid, achievementsManager.unlockAchievement);
    const shopState = useShopState(setGameState);

    // Game loop
    useEffect(() => {
        if (appState !== 'game' || loadStatus === 'loading') return;

        const gameTick = setInterval(() => {
            setGameState(prev => {
                const productionThisTick = prestigeState.productionTotal(prev) / (1000 / TICK_RATE);
                let energyFromProduction = productionThisTick;
                
                const { newLoan, wasLoanRepaid } = bankState.handleLoanRepayment(prev.currentLoan, productionThisTick);
                if (wasLoanRepaid) onLoanRepaid();
                energyFromProduction -= (productionThisTick * (newLoan ? LOAN_REPAYMENT_RATE : 0));
                
                const newTotalEnergyProduced = prev.totalEnergyProduced + productionThisTick;
                const newEnergy = Math.min(prev.energy + energyFromProduction, prestigeState.maxEnergy(prev));
                const newSavingsBalance = bankState.calculateInterest(prev);
                const newCoreCharge = prestigeState.calculateCoreCharge(prev);

                return { 
                    ...prev, 
                    energy: newEnergy, 
                    coreCharge: newCoreCharge, 
                    totalEnergyProduced: newTotalEnergyProduced, 
                    savingsBalance: newSavingsBalance, 
                    currentLoan: newLoan 
                };
            });
        }, TICK_RATE);
        return () => clearInterval(gameTick);
    }, [appState, loadStatus, prestigeState, bankState, onLoanRepaid]);

    // Check for achievements
    useEffect(() => {
        if (appState !== 'game' || loadStatus === 'loading') return;
        const currentProdTotal = prestigeState.productionTotal(gameState);
        const currentMaxEnergy = prestigeState.maxEnergy(gameState);
        achievementsManager.checkAll(gameState, currentProdTotal, currentMaxEnergy);
    }, [gameState, appState, loadStatus, achievementsManager, prestigeState]);
    
    useEffect(() => {
        const canAscendNow = prestigeState.canAscend(gameState);
        if (canAscendNow && !gameState.hasSeenAscensionTutorial) {
            onCanAscendFirstTime();
            setGameState(prev => ({...prev, hasSeenAscensionTutorial: true}));
        }
    }, [prestigeState, gameState, onCanAscendFirstTime]);

    useEffect(() => {
        if (gameState.totalEnergyProduced >= BANK_UNLOCK_TOTAL_ENERGY && !gameState.hasSeenBankTutorial) {
            onBankUnlockedFirstTime();
            setGameState(prev => ({...prev, hasSeenBankTutorial: true}));
        }
    }, [gameState.totalEnergyProduced, gameState.hasSeenBankTutorial, onBankUnlockedFirstTime]);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
        }
        setGameState(getInitialState());
        setLoadStatus('no_save');
    }, []);

    // DEV functions
    const dev_setEnergy = (amount: number) => setGameState(prev => ({ ...prev, energy: amount, totalEnergyProduced: Math.max(prev.totalEnergyProduced, amount)}));
    const dev_addEnergy = (amount: number) => setGameState(prev => ({ ...prev, energy: prev.energy + amount, totalEnergyProduced: prev.totalEnergyProduced + amount }));
    const dev_addAscension = () => setGameState(prev => ({ ...prev, ascensionLevel: prev.ascensionLevel + 1, ascensionPoints: prev.ascensionPoints + 10 }));
    const dev_unlockAllUpgrades = () => setGameState(prev => ({ ...prev, upgrades: prev.upgrades.map(u => ({...u, owned: Math.min(MAX_UPGRADE_LEVEL, u.owned + 10)}))}));
    
    return {
        gameState,
        computed: {
            ...prestigeState.getComputed(gameState),
            ...bankState.getComputed(gameState),
            // FIX: Merged playerState computed properties to expose them to consumers.
            ...playerState.getComputed(gameState),
        },
        actions: {
            ...playerState.actions,
            ...prestigeState.actions,
            ...bankState.actions,
            ...shopState.actions,
            unlockAchievement: achievementsManager.unlockAchievement,
            resetGame,
        },
        dev: {
            setEnergy: dev_setEnergy,
            addEnergy: dev_addEnergy,
            addAscension: dev_addAscension,
            unlockAllUpgrades: dev_unlockAllUpgrades,
            unlockAllAchievements: achievementsManager.dev_unlockAll,
            resetAchievements: achievementsManager.dev_reset,
        },
        loadStatus,
        saveGameState,
    };
};
