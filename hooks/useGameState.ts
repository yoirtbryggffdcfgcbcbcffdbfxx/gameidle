// FIX: Create the missing useGameState hook to manage all core game logic.
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GameState, Upgrade, Achievement, Settings, CoreUpgrade } from '../types';
import { SAVE_KEY, INITIAL_UPGRADES, TICK_RATE, MAX_UPGRADE_LEVEL, CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, ASCENSION_UPGRADES, CORE_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';

const getInitialState = (): GameState => {
    const upgradesWithState = INITIAL_UPGRADES.map(u => ({
        ...u,
        owned: 0,
        currentCost: u.baseCost,
    }));

    return {
        energy: 0,
        upgrades: upgradesWithState,
        ascensionLevel: 0,
        ascensionPoints: 0,
        achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a})),
        // Start with the 'start' nodes already purchased
        purchasedAscensionUpgrades: ['start'],
        totalClicks: 0,
        hasSeenAscensionTutorial: false,
        coreCharge: 0,
        isCoreDischarging: false,
        quantumShards: 0,
        purchasedCoreUpgrades: ['core_start'],
        hasSeenCoreTutorial: false,
    };
};


export const useGameState = (
    onAchievementUnlock: (achievement: Achievement) => void,
    onCanAscendFirstTime: () => void,
    appState: string
) => {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSaveData, setHasSaveData] = useState(false);
    const dischargeTimer = useRef<number | null>(null);

    const setEnergy = (newEnergy: number) => {
        setGameState(prev => ({...prev, energy: newEnergy}));
    };
    
    const setHasSeenCoreTutorial = (seen: boolean) => {
        setGameState(prev => ({...prev, hasSeenCoreTutorial: seen}));
    };

    // Load game state from local storage on mount
    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                const loadedData = JSON.parse(savedGame);
                // Simple migration: ensure all fields from initial state exist
                const initialState = getInitialState();
                const mergedState: GameState = {
                    ...initialState,
                    ...loadedData,
                     // Ensure 'start' nodes are always included after loading
                    purchasedAscensionUpgrades: [...new Set(['start', ...(loadedData.purchasedAscensionUpgrades || [])])],
                    purchasedCoreUpgrades: [...new Set(['core_start', ...(loadedData.purchasedCoreUpgrades || [])])],
                    achievements: loadedData.achievements ? loadedData.achievements.map((savedAch: Achievement) => {
                        const initialAch = INITIAL_ACHIEVEMENTS.find(ia => ia.name === savedAch.name);
                        return { ...initialAch, ...savedAch };
                    }) : initialState.achievements,
                };
                setGameState(mergedState);
                setHasSaveData(true);
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
            // If loading fails, start with a fresh game
            setGameState(getInitialState());
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveGameState = useCallback((settings: Settings) => {
        try {
            const stateToSave = { ...gameState, settings };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
            setHasSaveData(true);
        } catch (error) {
            console.error("Failed to save game state:", error);
        }
    }, [gameState]);


    // Bonuses calculations
    const ascensionBonuses = useMemo(() => {
        const bonuses = { productionMultiplier: 1, clickMultiplier: 1, costReduction: 1, startingEnergy: 0 };
        gameState.purchasedAscensionUpgrades.forEach(id => {
            const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
            if (upgrade) {
                switch(upgrade.effect.type) {
                    case 'PRODUCTION_MULTIPLIER': 
                        if (upgrade.id === 'prod_3_scaling') { // Special case for scaling upgrade
                            bonuses.productionMultiplier += gameState.ascensionLevel * upgrade.effect.value;
                        } else {
                            bonuses.productionMultiplier += upgrade.effect.value;
                        }
                        break;
                    case 'CLICK_POWER_MULTIPLIER': 
                         if (upgrade.id === 'click_3_scaling') { // Special case for scaling upgrade
                            bonuses.clickMultiplier += gameState.ascensionLevel * upgrade.effect.value;
                        } else {
                            bonuses.clickMultiplier += upgrade.effect.value;
                        }
                        break;
                    case 'COST_REDUCTION': bonuses.costReduction -= upgrade.effect.value; break;
                    case 'STARTING_ENERGY': bonuses.startingEnergy += upgrade.effect.value; break;
                }
            }
        });
        return bonuses;
    }, [gameState.purchasedAscensionUpgrades, gameState.ascensionLevel]);

    const achievementBonuses = useMemo(() => {
        const bonuses = { production: 1, click: 1, coreCharge: 1, costReduction: 1 };
        gameState.achievements.filter(a => a.unlocked).forEach(ach => {
             switch (ach.bonus.type) {
                case 'PRODUCTION': bonuses.production += ach.bonus.value / 100; break;
                case 'CLICK': bonuses.click += ach.bonus.value / 100; break;
                case 'CORE_CHARGE': bonuses.coreCharge += ach.bonus.value / 100; break;
                case 'COST_REDUCTION': bonuses.costReduction *= (1 - ach.bonus.value / 100); break;
            }
        });
        return bonuses;
    }, [gameState.achievements]);
    
    const coreBonuses = useMemo(() => {
        const bonuses = { chargeRate: 1, multiplier: 2, duration: CORE_DISCHARGE_DURATION };
        gameState.purchasedCoreUpgrades.forEach(id => {
            const upgrade = CORE_UPGRADES.find(u => u.id === id);
            if (upgrade) {
                switch(upgrade.effect.type) {
                    case 'CORE_CHARGE_RATE': bonuses.chargeRate += upgrade.effect.value; break;
                    case 'CORE_BOOST_MULTIPLIER': bonuses.multiplier += upgrade.effect.value; break;
                    case 'CORE_BOOST_DURATION': bonuses.duration += upgrade.effect.value; break;
                }
            }
        });
        return bonuses;
    }, [gameState.purchasedCoreUpgrades]);

    const costMultiplier = useMemo(() => ascensionBonuses.costReduction * achievementBonuses.costReduction, [ascensionBonuses, achievementBonuses]);
    
    // Derived state
    const productionTotal = useMemo(() => {
        const baseProduction = gameState.upgrades
            .filter(u => u.type === 'PRODUCTION')
            .reduce((sum, u) => sum + u.production * u.owned, 0);
            
        const boosterBonus = gameState.upgrades
            .filter(u => u.type === 'BOOSTER')
            .reduce((sum, u) => sum + u.production * u.owned, 0);

        let multiplier = ascensionBonuses.productionMultiplier * achievementBonuses.production * (1 + boosterBonus / 100);
        if (gameState.isCoreDischarging) {
            multiplier *= coreBonuses.multiplier;
        }

        return baseProduction * multiplier;
    }, [gameState.upgrades, ascensionBonuses, achievementBonuses, gameState.isCoreDischarging, coreBonuses]);

    const clickPowerFromUpgrades = useMemo(() => {
        return gameState.upgrades
            .filter(u => u.type === 'CLICK')
            .reduce((sum, u) => sum + u.production * u.owned, 0);
    }, [gameState.upgrades]);
    
    const maxEnergy = useMemo(() => {
        // Nouvelle formule : 1 milliard pour le niveau 0, puis x10 à chaque ascension.
        return 1e9 * Math.pow(10, gameState.ascensionLevel);
    }, [gameState.ascensionLevel]);

    const visibleUpgrades = useMemo(() => {
        return gameState.upgrades
            .map((upgradeData, originalIndex) => ({ upgradeData, originalIndex }))
            .filter(({ upgradeData }) => upgradeData.unlockCost <= gameState.energy || upgradeData.owned > 0)
            .filter(({ upgradeData }) => upgradeData.requiredAscension <= gameState.ascensionLevel);
    }, [gameState.upgrades, gameState.energy, gameState.ascensionLevel]);
    
    const unlockedUpgradesForCurrentAscension = useMemo(() => {
        return gameState.upgrades.filter(u => u.requiredAscension <= gameState.ascensionLevel);
    }, [gameState.upgrades, gameState.ascensionLevel]);
    
    const unlockedUpgradesAtMaxLevelCount = useMemo(() => {
         return unlockedUpgradesForCurrentAscension.filter(u => u.owned >= MAX_UPGRADE_LEVEL).length;
    }, [unlockedUpgradesForCurrentAscension]);
    
    const canAscend = useMemo(() => {
        const energyMet = gameState.energy >= maxEnergy;
        if (gameState.ascensionLevel === 0) {
            // For first ascension, you must max all available upgrades
            return energyMet && unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscension.length && unlockedUpgradesForCurrentAscension.length > 0;
        }
        return energyMet;
    }, [gameState.energy, maxEnergy, gameState.ascensionLevel, unlockedUpgradesAtMaxLevelCount, unlockedUpgradesForCurrentAscension.length]);

    const ascensionGain = useMemo(() => {
        if (!canAscend) return 1;
        // Nouvelle règle : le gain augmente de 1 tous les 2 niveaux d'ascension.
        return Math.floor(gameState.ascensionLevel / 2) + 1;
    }, [gameState.ascensionLevel, canAscend]);
    
    const totalUpgradesOwned = useMemo(() => gameState.upgrades.reduce((sum, u) => sum + u.owned, 0), [gameState.upgrades]);


    // Game loop
    useEffect(() => {
        if (appState !== 'game' || !isLoaded) return;

        const gameTick = setInterval(() => {
            setGameState(prev => {
                const newEnergy = Math.min(prev.energy + productionTotal / (1000 / TICK_RATE), maxEnergy);

                let newCoreCharge = prev.coreCharge;
                if (!prev.isCoreDischarging && newCoreCharge < 100) {
                    const chargeRate = (CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge) / (1000 / TICK_RATE);
                    newCoreCharge = Math.min(100, newCoreCharge + chargeRate);
                }

                return {...prev, energy: newEnergy, coreCharge: newCoreCharge };
            });

        }, TICK_RATE);
        return () => clearInterval(gameTick);
    }, [productionTotal, maxEnergy, appState, coreBonuses.chargeRate, achievementBonuses.coreCharge, isLoaded]);

     const checkAchievement = useCallback((name: string, condition: boolean) => {
        if (!condition) return;
        setGameState(prev => {
            const achievement = prev.achievements.find(a => a.name === name);
            if (achievement && !achievement.unlocked) {
                onAchievementUnlock({...achievement, unlocked: true});
                return {
                    ...prev,
                    achievements: prev.achievements.map(a => a.name === name ? {...a, unlocked: true} : a)
                };
            }
            return prev;
        });
    }, [onAchievementUnlock]);

    // Check for achievements
    useEffect(() => {
        if (appState !== 'game' || !isLoaded) return;

        checkAchievement("Allumage", gameState.energy >= 1000);
        checkAchievement("Fusion Stellaire", gameState.energy >= 100000);
        checkAchievement("Horizon des Événements", gameState.energy >= 10000000);
        checkAchievement("Milliardaire Quantique", gameState.energy >= 1000000000);
        checkAchievement("Divinité Énergétique", gameState.energy >= maxEnergy);
        
        checkAchievement("Flux Constant", productionTotal >= 1000);
        checkAchievement("Automatisation Complète", productionTotal >= 100000);
        checkAchievement("Moteur de l'Infini", productionTotal >= 1e7);
        checkAchievement("Singularité Déchaînée", productionTotal >= 1e9);
        
        checkAchievement("Amorce d'Empire", totalUpgradesOwned >= 50);
        checkAchievement("Architecte Industriel", totalUpgradesOwned >= 250);
        checkAchievement("Magnat de la Technologie", totalUpgradesOwned >= 750);
        checkAchievement("Souverain Galactique", totalUpgradesOwned >= 1500);
        
        const galacCollector = gameState.upgrades.find(u => u.name === "Collecteur Galactique Theta");
        if (galacCollector) {
            checkAchievement("Collectionneur Cosmique", galacCollector.owned >= 100);
        }

    }, [gameState.energy, productionTotal, totalUpgradesOwned, appState, gameState.upgrades, checkAchievement, isLoaded, maxEnergy]);
    
    // Check for ascension tutorial
    useEffect(() => {
        if (canAscend && !gameState.hasSeenAscensionTutorial) {
            onCanAscendFirstTime();
            setGameState(prev => ({...prev, hasSeenAscensionTutorial: true}));
        }
    }, [canAscend, gameState.hasSeenAscensionTutorial, onCanAscendFirstTime]);

    // Game Actions
    const unlockAchievement = useCallback((name: string) => {
        checkAchievement(name, true);
    }, [checkAchievement]);

    const incrementClickCount = () => {
        setGameState(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
        checkAchievement("Frénésie du Clic", gameState.totalClicks + 1 >= 1000);
        checkAchievement("Tempête de Clics", gameState.totalClicks + 1 >= 100000);
    };

    const buyUpgrade = (index: number) => {
        const upgrade = gameState.upgrades[index];
        if (gameState.energy >= upgrade.currentCost && upgrade.owned < MAX_UPGRADE_LEVEL) {
            setGameState(prev => {
                const newUpgrades = [...prev.upgrades];
                const newUpgrade = { ...newUpgrades[index] };
                newUpgrade.owned++;
                newUpgrade.currentCost = calculateCost(newUpgrade.baseCost, newUpgrade.owned, costMultiplier);

                newUpgrades[index] = newUpgrade;
                return { ...prev, energy: prev.energy - upgrade.currentCost, upgrades: newUpgrades };
            });
            return true;
        }
        return false;
    };
    
    const doAscension = () => {
        if (!canAscend) return false;
        
        const nextAscensionLevel = gameState.ascensionLevel + 1;
        checkAchievement("Transcendance", nextAscensionLevel >= 5);
        checkAchievement("Maître du Multivers", nextAscensionLevel >= 10);
        checkAchievement("Légende Éternelle", nextAscensionLevel >= 25);
        
        setGameState(prev => {
            const initialState = getInitialState();
            return {
                ...initialState,
                energy: ascensionBonuses.startingEnergy,
                ascensionLevel: prev.ascensionLevel + 1,
                ascensionPoints: prev.ascensionPoints + ascensionGain,
                quantumShards: prev.quantumShards + ascensionGain,
                achievements: prev.achievements, // Keep achievements
                purchasedAscensionUpgrades: prev.purchasedAscensionUpgrades,
                purchasedCoreUpgrades: prev.purchasedCoreUpgrades,
                hasSeenAscensionTutorial: true,
                hasSeenCoreTutorial: prev.hasSeenCoreTutorial,
                totalClicks: prev.totalClicks // Keep total clicks
            };
        });
        return true;
    };
    
    const buyAscensionUpgrade = (id: string) => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        const canAfford = gameState.ascensionPoints >= upgrade.cost;
        const isPurchased = gameState.purchasedAscensionUpgrades.includes(id);
        const requirementsMet = upgrade.required.every(reqId => gameState.purchasedAscensionUpgrades.includes(reqId));

        if (canAfford && !isPurchased && requirementsMet) {
            setGameState(prev => ({
                ...prev,
                ascensionPoints: prev.ascensionPoints - upgrade.cost,
                purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, id],
            }));
            checkAchievement("Première Transcendance", gameState.purchasedAscensionUpgrades.length === 2);
            return true;
        }
        return false;
    };

    const buyCoreUpgrade = (id: string) => {
        const upgrade = CORE_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        const canAfford = gameState.quantumShards >= upgrade.cost;
        const isPurchased = gameState.purchasedCoreUpgrades.includes(id);
        const requirementsMet = upgrade.required.every(reqId => gameState.purchasedCoreUpgrades.includes(reqId));
        
        if (canAfford && !isPurchased && requirementsMet) {
            setGameState(prev => ({
                ...prev,
                quantumShards: prev.quantumShards - upgrade.cost,
                purchasedCoreUpgrades: [...prev.purchasedCoreUpgrades, id],
            }));
            checkAchievement("Noyau Amélioré", gameState.purchasedCoreUpgrades.length === 2);
            return true;
        }
        return false;
    };

    const dischargeCore = () => {
        if (gameState.coreCharge >= 100 && !gameState.isCoreDischarging) {
            setGameState(prev => ({ ...prev, isCoreDischarging: true, coreCharge: 0 }));

            if (dischargeTimer.current) clearTimeout(dischargeTimer.current);
            dischargeTimer.current = window.setTimeout(() => {
                setGameState(prev => ({ ...prev, isCoreDischarging: false }));
                dischargeTimer.current = null;
            }, coreBonuses.duration);

            return true;
        }
        return false;
    };
    
    const resetGame = (hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
        }
        setGameState(getInitialState());
        setHasSaveData(false);
    };
    
    const unlockSpecificUpgrade = () => { /* Placeholder if needed */ };

    // Dev Functions
    const dev_addAscension = () => setGameState(prev => ({ ...prev, ascensionLevel: prev.ascensionLevel + 1, ascensionPoints: prev.ascensionPoints + 10 }));
    const dev_unlockAllUpgrades = () => setGameState(prev => ({ ...prev, upgrades: prev.upgrades.map(u => ({...u, owned: Math.min(MAX_UPGRADE_LEVEL, u.owned + 10)}))}));
    const dev_unlockAllAchievements = () => setGameState(prev => ({ ...prev, achievements: prev.achievements.map(a => ({...a, unlocked: true}))}));
    const dev_resetAchievements = () => setGameState(prev => ({ ...prev, achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a}))}));

    return {
        ...gameState,
        isLoaded,
        hasSaveData,
        setEnergy,
        setHasSeenCoreTutorial,
        saveGameState,
        productionTotal,
        clickPowerFromUpgrades,
        maxEnergy,
        visibleUpgrades,
        unlockedUpgradesForCurrentAscension,
        unlockedUpgradesAtMaxLevelCount,
        canAscend,
        ascensionGain,
        totalUpgradesOwned,
        ascensionBonuses,
        achievementBonuses,
        coreBonuses,
        
        // Actions
        buyUpgrade,
        doAscension,
        buyAscensionUpgrade,
        buyCoreUpgrade,
        dischargeCore,
        resetGame,
        incrementClickCount,
        unlockAchievement,
        unlockSpecificUpgrade,

        // Dev
        dev_addAscension,
        dev_unlockAllUpgrades,
        dev_unlockAllAchievements,
        dev_resetAchievements,
    };
};