import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings, PrestigeUpgrade } from '../types';
import { MAX_ENERGY, INITIAL_UPGRADES, SAVE_KEY, PRESTIGE_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';

export const useGameState = (onAchievementUnlock: (achievement: Achievement) => void) => {
    const [energy, _setEnergy] = useState(0);
    const energyRef = useRef(energy);

    const setEnergy = useCallback((value: number | ((prev: number) => number)) => {
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
    const unlockingRef = useRef(new Set<string>()); // Synchronous guard against unlock race conditions
    const [purchasedPrestigeUpgrades, setPurchasedPrestigeUpgrades] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSaveData, setHasSaveData] = useState(false);

    const prestigeBonuses = useMemo(() => {
        const bonuses = {
            productionMultiplier: 1,
            clickMultiplier: 1,
            costReduction: 1,
            startingEnergy: 0,
        };
        purchasedPrestigeUpgrades.forEach(upgradeId => {
            const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) return;
            switch(upgrade.effect.type) {
                case 'PRODUCTION_MULTIPLIER':
                    bonuses.productionMultiplier *= upgrade.effect.value;
                    break;
                case 'CLICK_POWER_MULTIPLIER':
                    bonuses.clickMultiplier *= upgrade.effect.value;
                    break;
                case 'COST_REDUCTION':
                    bonuses.costReduction *= upgrade.effect.value;
                    break;
                case 'STARTING_ENERGY':
                    bonuses.startingEnergy += upgrade.effect.value;
                    break;
            }
        });
        return bonuses;
    }, [purchasedPrestigeUpgrades]);

    const productionTotal = useMemo(() => {
        const baseProduction = upgrades.reduce((total, u) => total + u.production * u.owned, 0);
        return baseProduction * prestigeBonuses.productionMultiplier;
    }, [upgrades, prestigeBonuses.productionMultiplier]);

    const totalUpgradesOwned = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.owned, 0);
    }, [upgrades]);

    const canPrestige = useMemo(() => energy >= MAX_ENERGY && totalUpgradesOwned >= 10, [energy, totalUpgradesOwned]);
    
    const prestigeGain = useMemo(() => {
        if (!canPrestige) return 0;
        return Math.floor(totalUpgradesOwned / 10);
    }, [totalUpgradesOwned, canPrestige]);

    useEffect(() => {
        if (!isLoaded) return;
        const gameTick = setInterval(() => {
            setEnergy(prev => Math.min(prev + productionTotal, MAX_ENERGY));
        }, 1000);
        return () => clearInterval(gameTick);
    }, [productionTotal, isLoaded, setEnergy]);
    
    useEffect(() => {
        setUpgrades(currentUpgrades => 
            currentUpgrades.map(u => ({
                ...u,
                currentCost: calculateCost(u.baseCost, u.owned, prestigeBonuses.costReduction)
            }))
        );
    }, [prestigeBonuses.costReduction]);

    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                setHasSaveData(true);
                const data = JSON.parse(savedGame);
                setEnergy(data.energy || 0);
                setPrestigeCount(data.prestigeCount || 0);
                setPurchasedPrestigeUpgrades(data.purchasedPrestigeUpgrades || []);
                
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
                
                // Populate the synchronous guard with already unlocked achievements from save
                loadedAchievements.forEach(a => {
                    if (a.unlocked) {
                        unlockingRef.current.add(a.name);
                    }
                });
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
        } finally {
            setIsLoaded(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setEnergy]);

    const saveGameState = useCallback((currentSettings: Settings) => {
        const gameState = { 
            energy, 
            upgrades: upgrades.map(({name, owned}) => ({name, owned})), 
            prestigeCount, 
            achievements,
            purchasedPrestigeUpgrades,
            settings: currentSettings,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }, [energy, upgrades, prestigeCount, achievements, purchasedPrestigeUpgrades]);

    const buyUpgrade = useCallback((index: number) => {
        const upgrade = upgrades[index];
        if (energyRef.current >= upgrade.currentCost) {
            setEnergy(e => e - upgrade.currentCost);
            setUpgrades(currentUpgrades => {
                const newUpgrades = [...currentUpgrades];
                const targetUpgrade = newUpgrades[index];
                targetUpgrade.owned++;
                targetUpgrade.currentCost = calculateCost(targetUpgrade.baseCost, targetUpgrade.owned, prestigeBonuses.costReduction);
                return newUpgrades;
            });
            return true;
        }
        return false;
    }, [upgrades, setEnergy, prestigeBonuses.costReduction]);

    const unlockAchievement = useCallback((name: string) => {
        // Synchronous check to prevent re-triggering during the same session/tick.
        if (unlockingRef.current.has(name)) {
            return;
        }

        // Check against current state as a pre-emptive measure.
        const isAlreadyUnlockedInState = achievements.find(a => a.name === name)?.unlocked;
        if (isAlreadyUnlockedInState) {
            unlockingRef.current.add(name); // Ensure guard is also set.
            return;
        }

        // Set the lock SYNCHRONOUSLY, BEFORE any async state updates. This is the crucial fix.
        unlockingRef.current.add(name);

        setAchievements(prev => {
            const achievementIndex = prev.findIndex(a => a.name === name);
            // The check inside the updater is the final source of truth.
            if (achievementIndex > -1 && !prev[achievementIndex].unlocked) {
                const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === name);
                if (achievementData) {
                    onAchievementUnlock(achievementData);
                }
                const newAchievements = [...prev];
                newAchievements[achievementIndex] = { ...newAchievements[achievementIndex], unlocked: true };
                return newAchievements;
            }
            return prev;
        });
    }, [onAchievementUnlock, achievements]);

    // Achievement Unlocking Effect - Now co-located with the state it depends on.
    useEffect(() => {
        if (!isLoaded) return;
        
        const checkAndUnlock = (condition: boolean, achievementName: string) => {
            if (!condition) return;
            const achievement = achievements.find(a => a.name === achievementName);
            if (achievement && !achievement.unlocked) {
                unlockAchievement(achievementName);
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

    }, [totalUpgradesOwned, energy, productionTotal, prestigeCount, achievements, unlockAchievement, isLoaded]);

    const doPrestige = useCallback(() => {
        if (canPrestige) {
            setPrestigeCount(prev => prev + prestigeGain);
            setEnergy(prestigeBonuses.startingEnergy);
            setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, prestigeBonuses.costReduction) })));
            return true;
        }
        return false;
    }, [canPrestige, prestigeGain, setEnergy, prestigeBonuses]);
    
    const buyPrestigeUpgrade = useCallback((upgradeId: string) => {
        const upgrade = PRESTIGE_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade && prestigeCount >= upgrade.cost && !purchasedPrestigeUpgrades.includes(upgradeId)) {
            setPrestigeCount(pc => pc - upgrade.cost);
            setPurchasedPrestigeUpgrades(prev => [...prev, upgradeId]);
            return true;
        }
        return false;
    }, [prestigeCount, purchasedPrestigeUpgrades]);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
            setHasSaveData(false);
            setPurchasedPrestigeUpgrades([]);
            setPrestigeCount(0);
        }
        setEnergy(hardReset ? 0 : prestigeBonuses.startingEnergy);
        if(!hardReset) setPrestigeCount(0);
        setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, hardReset ? 1 : prestigeBonuses.costReduction) })));
        setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
        
        // Clear the synchronous guard on any reset
        unlockingRef.current.clear();

    }, [setEnergy, prestigeBonuses]);

    return {
        energy,
        setEnergy,
        upgrades,
        prestigeCount,
        productionTotal,
        prestigeBonuses,
        purchasedPrestigeUpgrades,
        achievements,
        totalUpgradesOwned,
        canPrestige,
        prestigeGain,
        isLoaded,
        hasSaveData,
        saveGameState,
        buyUpgrade,
        doPrestige,
        buyPrestigeUpgrade,
        resetGame,
        unlockAchievement,
    };
};
