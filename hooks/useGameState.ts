import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings } from '../types';
import { MAX_ENERGY, INITIAL_UPGRADES, INITIAL_ACHIEVEMENTS, SAVE_KEY } from '../constants';
import { calculateCost } from '../utils/helpers';

export const useGameState = () => {
    const [energy, _setEnergy] = useState(0);
    const energyRef = useRef(energy);

    // Custom setter to keep the ref perfectly in sync with the state.
    // This solves the race condition where the check could use a different energy value than the deduction.
    const setEnergy = useCallback((value) => {
        if (typeof value === 'function') {
            _setEnergy(currentVal => {
                const newVal = value(currentVal);
                energyRef.current = newVal;
                return newVal;
            })
        } else {
            energyRef.current = value;
            _setEnergy(value);
        }
    }, []);

    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => 
        INITIAL_UPGRADES.map(u => ({ ...u, currentCost: calculateCost(u.baseCost, u.owned) }))
    );
    const [prestigeCount, setPrestigeCount] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSaveData, setHasSaveData] = useState(false);

    const productionTotal = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.production * u.owned, 0);
    }, [upgrades]);

    const totalUpgradesOwned = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.owned, 0);
    }, [upgrades]);

    const canPrestige = useMemo(() => energy >= MAX_ENERGY && totalUpgradesOwned >= 10, [energy, totalUpgradesOwned]);

    // Game tick
    useEffect(() => {
        if (!isLoaded) return;
        const gameTick = setInterval(() => {
            setEnergy(prev => Math.min(prev + productionTotal, MAX_ENERGY));
        }, 1000);
        return () => clearInterval(gameTick);
    }, [productionTotal, isLoaded, setEnergy]);
    
    // Load game
    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                setHasSaveData(true);
                const data = JSON.parse(savedGame);
                setEnergy(data.energy || 0);
                setPrestigeCount(data.prestigeCount || 0);
                
                const loadedUpgrades = INITIAL_UPGRADES.map((u) => {
                    const savedUpgrade = data.upgrades?.find((su: any) => su.name === u.name);
                    const owned = savedUpgrade ? savedUpgrade.owned : 0;
                    return { ...u, owned, currentCost: calculateCost(u.baseCost, owned) };
                });
                setUpgrades(loadedUpgrades);
                
                const loadedAchievements = INITIAL_ACHIEVEMENTS.map((a) => {
                     const savedAchievement = data.achievements?.find((sa: any) => sa.name === a.name);
                     return savedAchievement ? { ...a, unlocked: savedAchievement.unlocked } : a;
                });
                setAchievements(loadedAchievements);
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
        } finally {
            setIsLoaded(true);
        }
    }, [setEnergy]);

    const saveGameState = useCallback((currentSettings: Settings) => {
        const gameState = { 
            energy, 
            upgrades: upgrades.map(({name, owned}) => ({name, owned})), 
            prestigeCount, 
            achievements,
            settings: currentSettings,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }, [energy, upgrades, prestigeCount, achievements]);

    const buyUpgrade = useCallback((index: number) => {
        const upgrade = upgrades[index];
        // Use the ref for the check to ensure we have the most up-to-date energy value.
        if (energyRef.current >= upgrade.currentCost) {
            setEnergy(e => e - upgrade.currentCost);
            
            // Use an updater function to prevent race conditions from rapid clicks.
            setUpgrades(currentUpgrades => {
                const newUpgrades = [...currentUpgrades];
                const targetUpgrade = newUpgrades[index];
                
                targetUpgrade.owned++;
                targetUpgrade.currentCost = calculateCost(targetUpgrade.baseCost, targetUpgrade.owned);
                
                return newUpgrades;
            });
            return true;
        }
        return false;
    }, [upgrades, setEnergy]);

    const unlockAchievement = useCallback((name: string) => {
        let wasUnlocked = false;
        setAchievements(prev => {
            const achievementIndex = prev.findIndex(a => a.name === name);
            if (achievementIndex > -1 && !prev[achievementIndex].unlocked) {
                wasUnlocked = true;
                const newAchievements = prev.map((a, i) => i === achievementIndex ? { ...a, unlocked: true } : a);
                return newAchievements;
            }
            return prev;
        });
        return wasUnlocked;
    }, []);

    const doPrestige = useCallback(() => {
        if (canPrestige) {
            setPrestigeCount(prev => prev + 1);
            setEnergy(0);
            setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0) })));
            unlockAchievement("Première Prestige");
            return true;
        }
        return false;
    }, [canPrestige, unlockAchievement, setEnergy]);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
        }
        setEnergy(0);
        setPrestigeCount(0);
        setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0) })));
        setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a })));
    }, [setEnergy]);

    return {
        energy,
        setEnergy,
        upgrades,
        prestigeCount,
        achievements,
        totalUpgradesOwned,
        canPrestige,
        isLoaded,
        hasSaveData,
        saveGameState,
        buyUpgrade,
        doPrestige,
        resetGame,
        unlockAchievement,
    };
};