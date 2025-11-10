// FIX: Create the missing useGameState hook to manage all core game logic.
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GameState, Upgrade, Achievement, Settings } from '../types';
import { SAVE_KEY, INITIAL_UPGRADES, TICK_RATE, MAX_UPGRADE_LEVEL, CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, ASCENSION_UPGRADES, CORE_UPGRADES, LOAN_REPAYMENT_RATE, BANK_UPGRADES, BANK_UNLOCK_TOTAL_ENERGY, SHOP_UPGRADES } from '../constants';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { calculateCost } from '../utils/helpers';
import { usePlayerActions } from './actions/usePlayerActions';
import { usePrestigeActions } from './actions/usePrestigeActions';
import { useBankActions } from './actions/useBankActions';
import { useShopActions } from './actions/useShopActions';
import { useAdminActions } from './actions/useAdminActions';

export interface LoanResult {
    success: boolean;
    reason?: 'loan_exists' | 'exceeds_max' | 'insufficient_collateral' | 'invalid_amount';
}

export interface WithdrawResult {
    success: boolean;
    reason?: 'zero_amount';
    withdrawnAmount?: number;
    repaidAmount?: number;
    toEnergyAmount?: number;
}

export interface UpgradeBankResult {
    success: boolean;
    reason?: 'max_level' | 'insufficient_energy' | 'loan_active';
    newLevel?: number;
}


export const getInitialState = (): GameState => {
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
        purchasedAscensionUpgrades: ['start'],
        totalClicks: 0,
        hasSeenAscensionTutorial: false,
        coreCharge: 0,
        isCoreDischarging: false,
        quantumShards: 0,
        purchasedCoreUpgrades: ['core_start'],
        hasSeenCoreTutorial: false,
        totalEnergyProduced: 0,
        isBankUnlocked: false,
        savingsBalance: 0,
        currentLoan: null,
        bankLevel: 0,
        hasSeenBankTutorial: false,
        purchasedShopUpgrades: [],
    };
};


export const useGameState = (
    onAchievementUnlock: (achievement: Achievement) => void,
    onCanAscendFirstTime: () => void,
    onLoanRepaid: () => void,
    onBankUnlockedFirstTime: () => void,
    appState: string
) => {
    const [gameState, setGameState] = useState<GameState>(getInitialState());
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSaveData, setHasSaveData] = useState(false);

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
                const initialState = getInitialState();
                const mergedState: GameState = {
                    ...initialState,
                    ...loadedData,
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
                    case 'PRODUCTION_MULTIPLIER': bonuses.productionMultiplier += upgrade.effect.value; break;
                    case 'CLICK_POWER_MULTIPLIER': bonuses.clickMultiplier += upgrade.effect.value; break;
                    case 'COST_REDUCTION': bonuses.costReduction -= upgrade.effect.value; break;
                    case 'STARTING_ENERGY': bonuses.startingEnergy += upgrade.effect.value; break;
                }
            }
        });
        return bonuses;
    }, [gameState.purchasedAscensionUpgrades]);

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
    
    const bankBonuses = useMemo(() => {
        const currentLevel = Math.min(gameState.bankLevel, BANK_UPGRADES.length - 1);
        return BANK_UPGRADES[currentLevel];
    }, [gameState.bankLevel]);

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
            return energyMet && unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscension.length && unlockedUpgradesForCurrentAscension.length > 0;
        }
        return energyMet;
    }, [gameState.energy, maxEnergy, gameState.ascensionLevel, unlockedUpgradesAtMaxLevelCount, unlockedUpgradesForCurrentAscension.length]);

    const ascensionGain = useMemo(() => {
        if (!canAscend) return 1;
        return Math.floor(gameState.ascensionLevel / 2) + 1;
    }, [gameState.ascensionLevel, canAscend]);
    
    const totalUpgradesOwned = useMemo(() => gameState.upgrades.reduce((sum, u) => sum + u.owned, 0), [gameState.upgrades]);


    // Game loop
    useEffect(() => {
        if (appState !== 'game' || !isLoaded) return;

        const gameTick = setInterval(() => {
            setGameState(prev => {
                const productionThisTick = productionTotal / (1000 / TICK_RATE);
                const newTotalEnergyProduced = prev.totalEnergyProduced + productionThisTick;
                let energyFromProduction = productionThisTick;
                let newLoan = prev.currentLoan;
                let wasLoanRepaid = false;

                if (newLoan && newLoan.remaining > 0 && productionThisTick > 0) {
                    const repaymentAmount = productionThisTick * LOAN_REPAYMENT_RATE;
                    const actualRepayment = Math.min(repaymentAmount, newLoan.remaining);
                    energyFromProduction -= actualRepayment;
                    const remaining = newLoan.remaining - actualRepayment;
                    if (remaining <= 0) {
                        newLoan = null;
                        wasLoanRepaid = true;
                    } else {
                        newLoan = { ...newLoan, remaining };
                    }
                }
                
                const currentBankBonus = BANK_UPGRADES[Math.min(prev.bankLevel, BANK_UPGRADES.length - 1)];
                const interestThisTick = prev.savingsBalance * currentBankBonus.savingsInterest / (1000 / TICK_RATE);
                const newSavingsBalance = prev.savingsBalance + interestThisTick;
                const newEnergy = Math.min(prev.energy + energyFromProduction, maxEnergy);

                let newCoreCharge = prev.coreCharge;
                if (!prev.isCoreDischarging && newCoreCharge < 100) {
                    const chargeRate = (CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge) / (1000 / TICK_RATE);
                    newCoreCharge = Math.min(100, newCoreCharge + chargeRate);
                }
                
                if (wasLoanRepaid) onLoanRepaid();

                return { ...prev, energy: newEnergy, coreCharge: newCoreCharge, totalEnergyProduced: newTotalEnergyProduced, savingsBalance: newSavingsBalance, currentLoan: newLoan };
            });
        }, TICK_RATE);
        return () => clearInterval(gameTick);
    }, [productionTotal, maxEnergy, appState, coreBonuses.chargeRate, achievementBonuses.coreCharge, isLoaded, onLoanRepaid]);

     const checkAchievement = useCallback((name: string, condition: boolean) => {
        if (!condition) return;
        setGameState(prev => {
            const achievement = prev.achievements.find(a => a.name === name);
            if (achievement && !achievement.unlocked) {
                onAchievementUnlock({...achievement, unlocked: true});
                return { ...prev, achievements: prev.achievements.map(a => a.name === name ? {...a, unlocked: true} : a) };
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
        if (galacCollector) checkAchievement("Collectionneur Cosmique", galacCollector.owned >= 100);
    }, [gameState.energy, productionTotal, totalUpgradesOwned, appState, gameState.upgrades, checkAchievement, isLoaded, maxEnergy]);
    
    useEffect(() => {
        if (canAscend && !gameState.hasSeenAscensionTutorial) {
            onCanAscendFirstTime();
            setGameState(prev => ({...prev, hasSeenAscensionTutorial: true}));
        }
    }, [canAscend, gameState.hasSeenAscensionTutorial, onCanAscendFirstTime]);

    useEffect(() => {
        if (gameState.totalEnergyProduced >= BANK_UNLOCK_TOTAL_ENERGY && !gameState.hasSeenBankTutorial) {
            onBankUnlockedFirstTime();
            setGameState(prev => ({...prev, hasSeenBankTutorial: true}));
        }
    }, [gameState.totalEnergyProduced, gameState.hasSeenBankTutorial, onBankUnlockedFirstTime]);

    // Game Actions
    const unlockAchievement = useCallback((name: string) => {
        checkAchievement(name, true);
    }, [checkAchievement]);

    const playerActions = usePlayerActions(setGameState, gameState, costMultiplier, checkAchievement);
    const prestigeActions = usePrestigeActions(setGameState, gameState, canAscend, ascensionGain, ascensionBonuses, coreBonuses, checkAchievement);
    const bankActions = useBankActions(setGameState, gameState, maxEnergy, bankBonuses, onLoanRepaid, unlockAchievement, checkAchievement);
    const shopActions = useShopActions(setGameState, gameState);
    const adminActions = useAdminActions(setGameState, setHasSaveData);

    const unlockSpecificUpgrade = () => { /* Placeholder if needed */ };
    
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
        bankBonuses,
        costMultiplier,
        
        // Actions
        ...playerActions,
        ...prestigeActions,
        ...bankActions,
        ...shopActions,
        ...adminActions,
        unlockAchievement,
        unlockSpecificUpgrade,

        // Dev functions are now part of adminActions
        ...Object.keys(adminActions).filter(k => k.startsWith('dev_')).reduce((acc, key) => ({...acc, [key]: (adminActions as any)[key]}), {}),
    };
};
