import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings, PrestigeUpgrade } from '../types';
import { MAX_ENERGY, INITIAL_UPGRADES, SAVE_KEY, PRESTIGE_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';

export const useGameState = () => {
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
        // Gain 1 point for every 10 total upgrades owned, starting at 10.
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
                    return { ...u, owned, currentCost: calculateCost(u.baseCost, owned, prestigeBonuses.costReduction) };
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
    }, [setEnergy, prestigeBonuses.costReduction]);

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
        setAchievements(prev => {
            const achievementIndex = prev.findIndex(a => a.name === name);
            if (achievementIndex > -1 && !prev[achievementIndex].unlocked) {
                const newAchievements = [...prev];
                newAchievements[achievementIndex] = { ...newAchievements[achievementIndex], unlocked: true };
                return newAchievements;
            }
            return prev;
        });
    }, []);

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