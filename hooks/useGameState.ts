import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings, AscensionUpgrade, CoreUpgrade } from '../types';
import { INITIAL_UPGRADES, SAVE_KEY, ASCENSION_UPGRADES, MAX_UPGRADE_LEVEL, CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, CORE_PRODUCTION_MULTIPLIER, CORE_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';

export const useGameState = (onAchievementUnlock: (achievement: Achievement) => void, onShowAscensionTutorial: () => void) => {
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
    const [ascensionCount, setAscensionCount] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
    const unlockingRef = useRef(new Set<string>()); // Synchronous guard against unlock race conditions
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

    const maxEnergy = useMemo(() => 1_000_000_000 * Math.pow(10, ascensionCount), [ascensionCount]);

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
        return bonuses;
    }, [purchasedCoreUpgrades]);
    
    const achievementBonus = useMemo(() => {
        return achievements
            .filter(a => a.unlocked)
            .reduce((total, ach) => total * (1 + ach.bonus / 100), 1);
    }, [achievements]);

    const productionTotal = useMemo(() => {
        const baseProduction = upgrades
            .filter(u => u.type === 'PRODUCTION')
            .reduce((total, u) => total + u.production * u.owned, 0);
        let finalProduction = baseProduction * ascensionBonuses.productionMultiplier * achievementBonus;
        if (isCoreDischarging) {
            finalProduction *= coreBonuses.multiplier;
        }
        return finalProduction;
    }, [upgrades, ascensionBonuses.productionMultiplier, coreBonuses.multiplier, achievementBonus, isCoreDischarging]);
    
    const clickPowerFromUpgrades = useMemo(() => {
        return upgrades
            .filter(u => u.type === 'CLICK')
            .reduce((total, u) => total + u.production * u.owned, 0);
    }, [upgrades]);

    const totalUpgradesOwned = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.owned, 0);
    }, [upgrades]);

    const availableUpgradesForCurrentAscension = useMemo(() => {
        return upgrades.filter(u => u.requiredAscension <= ascensionCount);
    }, [upgrades, ascensionCount]);

    const upgradesAtMaxLevelCount = useMemo(() => {
        return availableUpgradesForCurrentAscension.filter(u => u.owned >= MAX_UPGRADE_LEVEL).length;
    }, [availableUpgradesForCurrentAscension]);

    const canAscend = useMemo(() => energy >= maxEnergy, [energy, maxEnergy]);
    
    const ascensionGain = useMemo(() => {
        if (!canAscend) return 0;
        return 1 + Math.floor(ascensionCount / 5);
    }, [canAscend, ascensionCount]);

    const visibleUpgrades = useMemo(() => {
        return upgrades
            .map((upgrade, index) => ({ upgradeData: upgrade, originalIndex: index }))
            .filter(({ upgradeData }) => unlockedUpgrades.has(upgradeData.id) && upgradeData.requiredAscension <= ascensionCount);
    }, [upgrades, unlockedUpgrades, ascensionCount]);

    // Effect to check for new upgrades to reveal based on current energy
    useEffect(() => {
        if (!isLoaded) return;
        const newlyUnlocked = new Set<string>();
        upgrades.forEach(u => {
            if (energy >= u.unlockCost && !unlockedUpgrades.has(u.id) && u.requiredAscension <= ascensionCount && u.id !== 'gen_1') {
                newlyUnlocked.add(u.id);
            }
        });
        if (newlyUnlocked.size > 0) {
            setUnlockedUpgrades(prev => new Set([...prev, ...newlyUnlocked]));
        }
    }, [energy, upgrades, unlockedUpgrades, isLoaded, ascensionCount]);

    useEffect(() => {
        if (!isLoaded) return;
        const gameTick = setInterval(() => {
            setEnergy(prev => Math.min(prev + productionTotal / 10, maxEnergy)); // Tick 10 times per second for smoother updates
            if (!isCoreDischarging) {
                setCoreCharge(c => Math.min(c + coreBonuses.chargeRate / 10, 100));
            }
        }, 100);
        return () => clearInterval(gameTick);
    }, [productionTotal, isLoaded, setEnergy, maxEnergy, isCoreDischarging, coreBonuses.chargeRate]);
    
    useEffect(() => {
        setUpgrades(currentUpgrades => 
            currentUpgrades.map(u => ({
                ...u,
                currentCost: calculateCost(u.baseCost, u.owned, ascensionBonuses.costReduction)
            }))
        );
    }, [ascensionBonuses.costReduction]);

    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                setHasSaveData(true);
                const data = JSON.parse(savedGame);
                const loadedAscensionCount = data.ascensionCount || 0;
                setEnergy(data.energy || 0);
                setAscensionCount(loadedAscensionCount);
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
                    if (owned > 0 && u.requiredAscension <= loadedAscensionCount) {
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
    // eslint-disable-next-line react-hooks-exhaustive-deps
    }, [setEnergy]);

    const saveGameState = useCallback((currentSettings: Settings) => {
        const gameState = { 
            energy, 
            upgrades: upgrades.map(({name, owned}) => ({name, owned})), 
            ascensionCount, 
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
    }, [energy, upgrades, ascensionCount, achievements, purchasedAscensionUpgrades, totalClicks, hasSeenAscensionTutorial, coreCharge, isCoreDischarging, quantumShards, purchasedCoreUpgrades, hasSeenCoreTutorial]);

    const buyUpgrade = useCallback((index: number) => {
        const upgrade = upgrades[index];
        if (upgrade.owned >= MAX_UPGRADE_LEVEL) return false;
        if (energyRef.current >= upgrade.currentCost) {
            setEnergy(e => e - upgrade.currentCost);
            setUpgrades(currentUpgrades => {
                const newUpgrades = [...currentUpgrades];
                const targetUpgrade = newUpgrades[index];
                targetUpgrade.owned++;
                targetUpgrade.currentCost = calculateCost(targetUpgrade.baseCost, targetUpgrade.owned, ascensionBonuses.costReduction);
                return newUpgrades;
            });
            return true;
        }
        return false;
    }, [upgrades, setEnergy, ascensionBonuses.costReduction]);
    
    const incrementClickCount = useCallback(() => setTotalClicks(c => c + 1), []);
    
    const unlockSpecificUpgrade = useCallback((id: string) => {
        setUnlockedUpgrades(prev => new Set([...prev, id]));
    }, []);

    const unlockAchievement = useCallback((name: string) => {
        if (unlockingRef.current.has(name)) {
            return;
        }
        const isAlreadyUnlockedInState = achievements.find(a => a.name === name)?.unlocked;
        if (isAlreadyUnlockedInState) {
            unlockingRef.current.add(name);
            return;
        }
        unlockingRef.current.add(name);
        setAchievements(prev => {
            const achievementIndex = prev.findIndex(a => a.name === name);
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

    useEffect(() => {
        if (!isLoaded) return;
        
        // Ascension Tutorial Check
        if (energy >= maxEnergy && ascensionCount === 0 && !hasSeenAscensionTutorial) {
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
        
        checkAndUnlock(ascensionCount >= 1, "Au-delà du Voile");
        checkAndUnlock(ascensionCount >= 5, "Transcendance");
        checkAndUnlock(ascensionCount >= 10, "Maître du Multivers");
        checkAndUnlock(ascensionCount >= 25, "Légende Éternelle");
        
        checkAndUnlock(totalClicks >= 1000, "Frénésie du Clic");

        const galacticCollector = upgrades.find(u => u.id === 'gen_10');
        checkAndUnlock(galacticCollector && galacticCollector.owned >= 100, "Collectionneur Cosmique");

    }, [totalUpgradesOwned, energy, productionTotal, ascensionCount, achievements, unlockAchievement, isLoaded, maxEnergy, totalClicks, upgrades, onShowAscensionTutorial, hasSeenAscensionTutorial]);

    const doAscension = useCallback(() => {
        if (canAscend) {
            const gain = ascensionGain;
            setAscensionCount(prev => prev + gain);
            setQuantumShards(prev => prev + gain);
            setEnergy(ascensionBonuses.startingEnergy);
            setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, ascensionBonuses.costReduction) })));
            setUnlockedUpgrades(new Set());
            setCoreCharge(0);
            setIsCoreDischarging(false);
            return true;
        }
        return false;
    }, [canAscend, ascensionGain, setEnergy, ascensionBonuses]);
    
    const buyAscensionUpgrade = useCallback((upgradeId: string) => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === upgradeId);
        if (upgrade && ascensionCount >= upgrade.cost && !purchasedAscensionUpgrades.includes(upgradeId)) {
            setAscensionCount(pc => pc - upgrade.cost);
            setPurchasedAscensionUpgrades(prev => [...prev, upgradeId]);
            return true;
        }
        return false;
    }, [ascensionCount, purchasedAscensionUpgrades]);

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
        }
        setEnergy(hardReset ? 0 : ascensionBonuses.startingEnergy);
        setAscensionCount(0);
        setTotalClicks(0);
        setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, owned: 0, currentCost: calculateCost(u.baseCost, 0, hardReset ? 1 : ascensionBonuses.costReduction) })));
        setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
        setUnlockedUpgrades(new Set());
        unlockingRef.current.clear();
        setCoreCharge(0);
        setIsCoreDischarging(false);

    }, [setEnergy, ascensionBonuses]);

    // --- DEV FUNCTIONS ---
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
        ascensionCount,
        setAscensionCount,
        productionTotal,
        clickPowerFromUpgrades,
        ascensionBonuses,
        purchasedAscensionUpgrades,
        achievements,
        totalUpgradesOwned,
        availableUpgradesForCurrentAscension,
        upgradesAtMaxLevelCount,
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
    };
};