import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings, AscensionUpgrade, CoreUpgrade } from '../types';
import { INITIAL_UPGRADES, SAVE_KEY, ASCENSION_UPGRADES, MAX_UPGRADE_LEVEL, CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, CORE_PRODUCTION_MULTIPLIER, CORE_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';

export const useGameState = (onAchievementUnlock: (achievement: Achievement) => void, onShowAscensionTutorial: () => void, appState: string) => {
    const [energy, _setEnergy] = useState(0);
    const energyRef = useRef(energy);
    const [totalClicks, setTotalClicks] = useState(0);

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
    const [ascensionLevel, setAscensionLevel] = useState(0);
    const [ascensionPoints, setAscensionPoints] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
    const [purchasedAscensionUpgrades, setPurchasedAscensionUpgrades] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSaveData, setHasSaveData] = useState(false);
    const [unlockedUpgrades, setUnlockedUpgrades] = useState<Set<string>>(new Set());
    const [hasSeenAscensionTutorial, setHasSeenAscensionTutorial] = useState(false);
    
    // Quantum Core State
    const [coreCharge, setCoreCharge] = useState(0);
    const [isCoreDischarging, setIsCoreDischarging] = useState(false);
    const [quantumShards, setQuantumShards] = useState(0);
    const [purchasedCoreUpgrades, setPurchasedCoreUpgrades] = useState<string[]>([]);
    const [hasSeenCoreTutorial, setHasSeenCoreTutorial] = useState(false);

    const maxEnergy = useMemo(() => 1_000_000_000 * Math.pow(10, ascensionLevel), [ascensionLevel]);

    const achievementBonuses = useMemo(() => {
        const bonuses = {
            production: 1,
            click: 1,
            coreCharge: 1,
            costReduction: 1,
        };
        achievements.filter(a => a.unlocked).forEach(ach => {
            switch(ach.bonus.type) {
                case 'PRODUCTION': bonuses.production *= (1 + ach.bonus.value / 100); break;
                case 'CLICK': bonuses.click *= (1 + ach.bonus.value / 100); break;
                case 'CORE_CHARGE': bonuses.coreCharge *= (1 + ach.bonus.value / 100); break;
                case 'COST_REDUCTION': bonuses.costReduction *= (1 - ach.bonus.value / 100); break;
            }
        });
        return bonuses;
    }, [achievements]);

    const ascensionBonuses = useMemo(() => {
        const bonuses = {
            productionMultiplier: 1,
            clickMultiplier: 1,
            costReduction: 1,
            startingEnergy: 0,
        };
        purchasedAscensionUpgrades.forEach(upgradeId => {
            const upgrade = ASCENSION_UPGRADES.find(u => u.id === upgradeId);
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
    }, [purchasedAscensionUpgrades]);

    const coreBonuses = useMemo(() => {
        const bonuses = {
            chargeRate: CORE_CHARGE_RATE,
            multiplier: CORE_PRODUCTION_MULTIPLIER,
        };
        purchasedCoreUpgrades.forEach(upgradeId => {
            const upgrade = CORE_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) return;
            switch(upgrade.effect.type) {
                case 'CORE_CHARGE_RATE':
                    bonuses.chargeRate += upgrade.effect.value;
                    break;
                case 'CORE_BOOST_MULTIPLIER':
                    bonuses.multiplier += upgrade.effect.value;
                    break;
            }
        });
        bonuses.chargeRate *= achievementBonuses.coreCharge;
        return bonuses;
    }, [purchasedCoreUpgrades, achievementBonuses.coreCharge]);
    
    const productionTotal = useMemo(() => {
        const baseProduction = upgrades
            .filter(u => u.type === 'PRODUCTION')
            .reduce((total, u) => total + u.production * u.owned, 0);
        let finalProduction = baseProduction * ascensionBonuses.productionMultiplier * achievementBonuses.production;
        if (isCoreDischarging) {
            finalProduction *= coreBonuses.multiplier;
        }
        return finalProduction;
    }, [upgrades, ascensionBonuses.productionMultiplier, achievementBonuses.production, coreBonuses.multiplier, isCoreDischarging]);
    
    const clickPowerFromUpgrades = useMemo(() => {
        return upgrades
            .filter(u => u.type === 'CLICK')
            .reduce((total, u) => total + u.production * u.owned, 0);
    }, [upgrades]);

    const totalUpgradesOwned = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.owned, 0);
    }, [upgrades]);

    const unlockedUpgradesForCurrentAscension = useMemo(() => {
        return upgrades.filter(u => unlockedUpgrades.has(u.id) && u.requiredAscension <= ascensionLevel);
    }, [upgrades, unlockedUpgrades, ascensionLevel]);

    const unlockedUpgradesAtMaxLevelCount = useMemo(() => {
        return unlockedUpgradesForCurrentAscension.filter(u => u.owned >= MAX_UPGRADE_LEVEL).length;
    }, [unlockedUpgradesForCurrentAscension]);

    const canAscend = useMemo(() => {
        if (ascensionLevel === 0) {
            const allUnlockedMaxed = unlockedUpgradesForCurrentAscension.length > 0 && unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscension.length;
            return energy >= maxEnergy && allUnlockedMaxed;
        }
        return energy >= maxEnergy;
    }, [energy, maxEnergy, ascensionLevel, unlockedUpgradesAtMaxLevelCount, unlockedUpgradesForCurrentAscension]);
    
    const ascensionGain = useMemo(() => {
        if (!canAscend) return 0;
        return 1 + Math.floor(ascensionLevel / 5);
    }, [canAscend, ascensionLevel]);

    const visibleUpgrades = useMemo(() => {
        return upgrades
            .map((upgrade, index) => ({ upgradeData: upgrade, originalIndex: index }))
            .filter(({ upgradeData }) => unlockedUpgrades.has(upgradeData.id) && upgradeData.requiredAscension <= ascensionLevel);
    }, [upgrades, unlockedUpgrades, ascensionLevel]);

    // Effect to check for new upgrades to reveal based on current energy
    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const newlyUnlocked = new Set<string>();
        upgrades.forEach(u => {
            if (energy >= u.unlockCost && !unlockedUpgrades.has(u.id) && u.requiredAscension <= ascensionLevel && u.id !== 'gen_1') {
                newlyUnlocked.add(u.id);
            }
        });
        if (newlyUnlocked.size > 0) {
            setUnlockedUpgrades(prev => new Set([...prev, ...newlyUnlocked]));
        }
    }, [energy, upgrades, unlockedUpgrades, isLoaded, ascensionLevel, appState]);

    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const gameTick = setInterval(() => {
            setEnergy(prev => Math.min(prev + productionTotal / 10, maxEnergy)); // Tick 10 times per second for smoother updates
            if (!isCoreDischarging) {
                setCoreCharge(c => Math.min(c + coreBonuses.chargeRate / 10, 100));
            }
        }, 100);
        return () => clearInterval(gameTick);
    }, [productionTotal, isLoaded, setEnergy, maxEnergy, isCoreDischarging, coreBonuses.chargeRate, appState]);
    
    useEffect(() => {
        setUpgrades(currentUpgrades => 
            currentUpgrades.map(u => ({
                ...u,
                currentCost: calculateCost(u.baseCost, u.owned, ascensionBonuses.costReduction * achievementBonuses.costReduction)
            }))
        );
    }, [ascensionBonuses.costReduction, achievementBonuses.costReduction]);

    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                setHasSaveData(true);
                const data = JSON.parse(savedGame);
                const loadedAscensionLevel = data.ascensionLevel || 0;
                setEnergy(data.energy || 0);
                setAscensionLevel(loadedAscensionLevel);
                setAscensionPoints(data.ascensionPoints || 0);
                setTotalClicks(data.totalClicks || 0);
                setPurchasedAscensionUpgrades(data.purchasedAscensionUpgrades || []);
                setHasSeenAscensionTutorial(data.hasSeenAscensionTutorial || false);
                setCoreCharge(data.coreCharge || 0);
                setIsCoreDischarging(data.isCoreDischarging || false);
                setQuantumShards(data.quantumShards || 0);
                setPurchasedCoreUpgrades(data.purchasedCoreUpgrades || []);
                setHasSeenCoreTutorial(data.hasSeenCoreTutorial || false);

                const revealedUpgrades = new Set<string>();
                if (data.energy > 10) revealedUpgrades.add('gen_1');
                const loadedUpgrades = INITIAL_UPGRADES.map((u) => {
                    const savedUpgrade = data.upgrades?.find((su: any) => su.name === u.name);
                    const owned = savedUpgrade ? savedUpgrade.owned : 0;
                    if (owned > 0 && u.requiredAscension <= loadedAscensionLevel) {
                        revealedUpgrades.add(u.id);
                    }
                    return { ...u, owned, currentCost: calculateCost(u.baseCost, owned) };
                });
                setUpgrades(loadedUpgrades);
                setUnlockedUpgrades(revealedUpgrades);
                
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setEnergy]);

    const saveGameState = useCallback((currentSettings: Settings) => {
        const gameState = { 
            energy, 
            upgrades: upgrades.map(({name, owned}) => ({name, owned})), 
            ascensionLevel,
            ascensionPoints, 
            achievements,
            purchasedAscensionUpgrades,
            totalClicks,
            settings: currentSettings,
            hasSeenAscensionTutorial,
            coreCharge,
            isCoreDischarging,
            quantumShards,
            purchasedCoreUpgrades,
            hasSeenCoreTutorial,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }, [energy, upgrades, ascensionLevel, ascensionPoints, achievements, purchasedAscensionUpgrades, totalClicks, hasSeenAscensionTutorial, coreCharge, isCoreDischarging, quantumShards, purchasedCoreUpgrades, hasSeenCoreTutorial]);

    const buyUpgrade = useCallback((index: number) => {
        const upgrade = upgrades[index];
        if (upgrade.owned >= MAX_UPGRADE_LEVEL) return false;
        if (energyRef.current >= upgrade.currentCost) {
            setEnergy(e => e - upgrade.currentCost);
            setUpgrades(currentUpgrades => {
                const newUpgrades = [...currentUpgrades];
                const targetUpgrade = newUpgrades[index];
                targetUpgrade.owned++;
                targetUpgrade.currentCost = calculateCost(targetUpgrade.baseCost, targetUpgrade.owned, ascensionBonuses.costReduction * achievementBonuses.costReduction);
                return newUpgrades;
            });
            return true;
        }
        return false;
    }, [upgrades, setEnergy, ascensionBonuses.costReduction, achievementBonuses.costReduction]);
    
    const incrementClickCount = useCallback(() => setTotalClicks(c => c + 1), []);
    
    const unlockSpecificUpgrade = useCallback((id: string) => {
        setUnlockedUpgrades(prev => new Set([...prev, id]));
    }, []);

    const unlockAchievement = useCallback((name: string) => {
        setAchievements(currentAchievements => {
            const ach = currentAchievements.find(a => a.name === name);

            // If achievement doesn't exist or is already unlocked, do nothing.
            if (!ach || ach.unlocked) {
                return currentAchievements;
            }

            // Fire the notification/sound effect callback with the original data
            const achievementData = INITIAL_ACHIEVEMENTS.find(a => a.name === name);
            if (achievementData) {
                onAchievementUnlock(achievementData);
            }

            // Create new state array with the unlocked achievement
            return currentAchievements.map(a => 
                a.name === name ? { ...a, unlocked: true } : a
            );
        });
    }, [onAchievementUnlock]);

    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        
        // Ascension Tutorial Check
        if (energy >= maxEnergy && ascensionLevel === 0 && !hasSeenAscensionTutorial) {
            onShowAscensionTutorial();
            setHasSeenAscensionTutorial(true);
        }

        const checkAndUnlock = (condition: boolean, achievementName: string) => {
            if (!condition) return;
            const achievement = achievements.find(a => a.name === achievementName);
            if (achievement && !achievement.unlocked) {
                unlockAchievement(achievementName);
            }
        };

        checkAndUnlock(totalUpgradesOwned >= 25, "Amorce d'Empire");
        checkAndUnlock(totalUpgradesOwned >= 150, "Architecte Industriel");
        checkAndUnlock(totalUpgradesOwned >= 500, "Souverain Galactique");
        
        checkAndUnlock(energy >= 100, "Seuil de Puissance");
        checkAndUnlock(energy >= 5000, "Maîtrise Énergétique");
        checkAndUnlock(energy >= 100000, "Conscience Cosmique");
        checkAndUnlock(energy >= maxEnergy, "Divinité Énergétique");

        checkAndUnlock(productionTotal >= 10, "Flux Constant");
        checkAndUnlock(productionTotal >= 100, "Automatisation Complète");
        checkAndUnlock(productionTotal >= 1000, "Moteur de l'Infini");
        checkAndUnlock(productionTotal >= 100000, "Singularité Déchaînée");
        
        checkAndUnlock(ascensionLevel >= 1, "Au-delà du Voile");
        checkAndUnlock(ascensionLevel >= 5, "Transcendance");
        checkAndUnlock(ascensionLevel >= 10, "Maître du Multivers");
        checkAndUnlock(ascensionLevel >= 25, "Légende Éternelle");
        
        checkAndUnlock(totalClicks >= 1000, "Frénésie du Clic");

        const galacticCollector = upgrades.find(u => u.id === 'gen_10');
        checkAndUnlock(galacticCollector && galacticCollector.owned >= 100, "Collectionneur Cosmique");

    }, [totalUpgradesOwned, energy, productionTotal, ascensionLevel, achievements, unlockAchievement, isLoaded, maxEnergy, totalClicks, upgrades, onShowAscensionTutorial, hasSeenAscensionTutorial, appState]);

    const doAscension = useCallback(() => {
        if (canAscend) {
            const gain = ascensionGain;
            setAscensionLevel(prev => prev + 1);
            setAscensionPoints(prev => prev + gain);
            setQuantumShards(prev => prev + gain);
            setEnergy(ascensionBonuses.startingEnergy);
            setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, ascensionBonuses.costReduction * achievementBonuses.costReduction) })));
            setUnlockedUpgrades(new Set());
            setCoreCharge(0);
            setIsCoreDischarging(false);
            return true;
        }
        return false;
    }, [canAscend, ascensionGain, setEnergy, ascensionBonuses, achievementBonuses.costReduction]);
    
    const buyAscensionUpgrade = useCallback((upgradeId: string) => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade && ascensionPoints >= upgrade.cost && !purchasedAscensionUpgrades.includes(upgradeId)) {
            setAscensionPoints(pc => pc - upgrade.cost);
            setPurchasedAscensionUpgrades(prev => [...prev, upgradeId]);
            return true;
        }
        return false;
    }, [ascensionPoints, purchasedAscensionUpgrades]);

    const buyCoreUpgrade = useCallback((upgradeId: string) => {
        const upgrade = CORE_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade && quantumShards >= upgrade.cost && !purchasedCoreUpgrades.includes(upgradeId)) {
            setQuantumShards(shards => shards - upgrade.cost);
            setPurchasedCoreUpgrades(prev => [...prev, upgradeId]);
            return true;
        }
        return false;
    }, [quantumShards, purchasedCoreUpgrades]);
    
    const dischargeCore = useCallback(() => {
        if (coreCharge >= 100) {
            setIsCoreDischarging(true);
            setCoreCharge(0);
            setTimeout(() => {
                setIsCoreDischarging(false);
            }, CORE_DISCHARGE_DURATION);
            return true;
        }
        return false;
    }, [coreCharge]);

    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
            setHasSaveData(false);
            setPurchasedAscensionUpgrades([]);
            setPurchasedCoreUpgrades([]);
            setQuantumShards(0);
            setHasSeenAscensionTutorial(false);
            setHasSeenCoreTutorial(false);
            setAscensionLevel(0);
        }
        setEnergy(hardReset ? 0 : ascensionBonuses.startingEnergy);
        setAscensionPoints(0);
        setTotalClicks(0);
        setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, hardReset ? 1 : ascensionBonuses.costReduction * achievementBonuses.costReduction) })));
        setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
        setUnlockedUpgrades(new Set());
        setCoreCharge(0);
        setIsCoreDischarging(false);
    }, [setEnergy, ascensionBonuses, achievementBonuses]);

    // --- DEV FUNCTIONS ---
    const dev_addAscension = () => {
        setAscensionLevel(p => p + 1);
        setAscensionPoints(p => p + 10);
    };
    const dev_unlockAllUpgrades = () => {
        setUpgrades(prev => prev.map(u => ({...u, owned: u.owned + 10, currentCost: calculateCost(u.baseCost, u.owned + 10, ascensionBonuses.costReduction)})));
        setUnlockedUpgrades(new Set(upgrades.map(u => u.id)));
    };
    const dev_unlockAllAchievements = () => setAchievements(prev => prev.map(a => ({...a, unlocked: true})));
    const dev_resetAchievements = () => setAchievements(INITIAL_ACHIEVEMENTS);


    return {
        energy,
        setEnergy,
        upgrades,
        visibleUpgrades,
        ascensionLevel,
        ascensionPoints,
        setAscensionPoints, // For dev panel
        setAscensionLevel, // For dev panel
        productionTotal,
        clickPowerFromUpgrades,
        ascensionBonuses,
        achievementBonuses,
        purchasedAscensionUpgrades,
        achievements,
        totalUpgradesOwned,
        unlockedUpgradesForCurrentAscension,
        unlockedUpgradesAtMaxLevelCount,
        canAscend,
        ascensionGain,
        maxEnergy,
        isLoaded,
        hasSaveData,
        coreCharge,
        isCoreDischarging,
        quantumShards,
        purchasedCoreUpgrades,
        coreBonuses,
        hasSeenCoreTutorial,
        setHasSeenCoreTutorial,
        saveGameState,
        buyUpgrade,
        doAscension,
        buyAscensionUpgrade,
        buyCoreUpgrade,
        dischargeCore,
        resetGame,
        unlockAchievement,
        incrementClickCount,
        unlockSpecificUpgrade,
        dev_unlockAllUpgrades,
        dev_unlockAllAchievements,
        dev_resetAchievements,
        dev_addAscension,
    };
};
