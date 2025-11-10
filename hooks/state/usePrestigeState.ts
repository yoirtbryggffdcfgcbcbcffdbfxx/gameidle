import { useCallback, useRef } from 'react';
import { GameState } from '../../types';
// FIX: Import missing constants and helpers to resolve reference errors.
import { ASCENSION_UPGRADES } from '../../data/ascension';
import { CORE_UPGRADES } from '../../data/core';
import { MAX_UPGRADE_LEVEL, CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, TICK_RATE } from '../../constants';
import { getInitialState } from '../../utils/helpers';

type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const usePrestigeState = (setGameState: SetGameStateFn, checkAchievement: CheckAchievementFn) => {
    const dischargeTimer = useRef<number | null>(null);

    const getComputed = (gameState: GameState) => {
        const ascensionBonuses = { productionMultiplier: 1, clickMultiplier: 1, costReduction: 1, startingEnergy: 0 };
        gameState.purchasedAscensionUpgrades.forEach(id => {
            const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
            if (upgrade) {
                switch(upgrade.effect.type) {
                    case 'PRODUCTION_MULTIPLIER': ascensionBonuses.productionMultiplier += upgrade.effect.value; break;
                    case 'CLICK_POWER_MULTIPLIER': ascensionBonuses.clickMultiplier += upgrade.effect.value; break;
                    case 'COST_REDUCTION': ascensionBonuses.costReduction -= upgrade.effect.value; break;
                    case 'STARTING_ENERGY': ascensionBonuses.startingEnergy += upgrade.effect.value; break;
                }
            }
        });

        const achievementBonuses = { production: 1, click: 1, coreCharge: 1, costReduction: 1 };
        gameState.achievements.filter(a => a.unlocked).forEach(ach => {
             switch (ach.bonus.type) {
                case 'PRODUCTION': achievementBonuses.production += ach.bonus.value / 100; break;
                case 'CLICK': achievementBonuses.click += ach.bonus.value / 100; break;
                case 'CORE_CHARGE': achievementBonuses.coreCharge += ach.bonus.value / 100; break;
                case 'COST_REDUCTION': achievementBonuses.costReduction *= (1 - ach.bonus.value / 100); break;
            }
        });
        
        const coreBonuses = { chargeRate: 1, multiplier: 2, duration: CORE_DISCHARGE_DURATION };
        gameState.purchasedCoreUpgrades.forEach(id => {
            const upgrade = CORE_UPGRADES.find(u => u.id === id);
            if (upgrade) {
                switch(upgrade.effect.type) {
                    case 'CORE_CHARGE_RATE': coreBonuses.chargeRate += upgrade.effect.value; break;
                    case 'CORE_BOOST_MULTIPLIER': coreBonuses.multiplier += upgrade.effect.value; break;
                    case 'CORE_BOOST_DURATION': coreBonuses.duration += upgrade.effect.value; break;
                }
            }
        });

        const costMultiplier = ascensionBonuses.costReduction * achievementBonuses.costReduction;
        
        const baseProduction = gameState.upgrades
            .filter(u => u.type === 'PRODUCTION')
            .reduce((sum, u) => sum + u.production * u.owned, 0);
            
        const boosterBonus = gameState.upgrades
            .filter(u => u.type === 'BOOSTER')
            .reduce((sum, u) => sum + u.production * u.owned, 0);

        let productionMultiplier = ascensionBonuses.productionMultiplier * achievementBonuses.production * (1 + boosterBonus / 100);
        if (gameState.isCoreDischarging) {
            productionMultiplier *= coreBonuses.multiplier;
        }
        const productionTotal = baseProduction * productionMultiplier;

        const maxEnergy = 1e9 * Math.pow(10, gameState.ascensionLevel);
        const unlockedUpgradesForCurrentAscension = gameState.upgrades.filter(u => u.requiredAscension <= gameState.ascensionLevel);
        const unlockedUpgradesAtMaxLevelCount = unlockedUpgradesForCurrentAscension.filter(u => u.owned >= MAX_UPGRADE_LEVEL).length;
        
        let canAscend = false;
        const energyMet = gameState.energy >= maxEnergy;
        if (gameState.ascensionLevel === 0) {
            canAscend = energyMet && unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscension.length && unlockedUpgradesForCurrentAscension.length > 0;
        } else {
            canAscend = energyMet;
        }

        const ascensionGain = canAscend ? Math.floor(gameState.ascensionLevel / 2) + 1 : 1;
        const visibleUpgrades = gameState.upgrades
            .map((upgradeData, originalIndex) => ({ upgradeData, originalIndex }))
            .filter(({ upgradeData }) => upgradeData.unlockCost <= gameState.energy || upgradeData.owned > 0)
            .filter(({ upgradeData }) => upgradeData.requiredAscension <= gameState.ascensionLevel);

        return {
            ascensionBonuses,
            achievementBonuses,
            coreBonuses,
            costMultiplier,
            productionTotal,
            maxEnergy,
            canAscend,
            ascensionGain,
            visibleUpgrades,
            unlockedUpgradesAtMaxLevelCount,
            unlockedUpgradesForCurrentAscensionCount: unlockedUpgradesForCurrentAscension.length,
        };
    };

    const doAscension = useCallback((): boolean => {
        let success = false;
        setGameState(prev => {
            const { canAscend, ascensionGain, ascensionBonuses } = getComputed(prev);
            if (!canAscend) return prev;

            success = true;
            const nextAscensionLevel = prev.ascensionLevel + 1;
            checkAchievement("Transcendance", nextAscensionLevel >= 5);
            checkAchievement("Maître du Multivers", nextAscensionLevel >= 10);
            checkAchievement("Légende Éternelle", nextAscensionLevel >= 25);
            
            const initialState = getInitialState();
            return {
                ...initialState,
                energy: ascensionBonuses.startingEnergy,
                ascensionLevel: nextAscensionLevel,
                ascensionPoints: prev.ascensionPoints + ascensionGain,
                quantumShards: prev.quantumShards + ascensionGain,
                achievements: prev.achievements,
                purchasedAscensionUpgrades: prev.purchasedAscensionUpgrades,
                purchasedCoreUpgrades: prev.purchasedCoreUpgrades,
                purchasedShopUpgrades: prev.purchasedShopUpgrades,
                hasSeenAscensionTutorial: true,
                hasSeenCoreTutorial: prev.hasSeenCoreTutorial,
                hasSeenBankTutorial: prev.hasSeenBankTutorial,
                totalClicks: prev.totalClicks,
                isBankUnlocked: prev.isBankUnlocked,
                bankLevel: prev.bankLevel,
            };
        });
        return success;
    }, [setGameState, checkAchievement]);
    
    const buyAscensionUpgrade = useCallback((id: string): boolean => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;
        let success = false;
        setGameState(prev => {
            if (prev.ascensionPoints >= upgrade.cost && !prev.purchasedAscensionUpgrades.includes(id) && upgrade.required.every(req => prev.purchasedAscensionUpgrades.includes(req))) {
                success = true;
                if (prev.purchasedAscensionUpgrades.length === 1) checkAchievement("Première Transcendance", true);
                return { ...prev, ascensionPoints: prev.ascensionPoints - upgrade.cost, purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, id] };
            }
            return prev;
        });
        return success;
    }, [setGameState, checkAchievement]);

    const buyCoreUpgrade = useCallback((id: string): boolean => {
        const upgrade = CORE_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;
        let success = false;
        setGameState(prev => {
            if (prev.quantumShards >= upgrade.cost && !prev.purchasedCoreUpgrades.includes(id) && upgrade.required.every(req => prev.purchasedCoreUpgrades.includes(req))) {
                success = true;
                if (prev.purchasedCoreUpgrades.length === 1) checkAchievement("Noyau Amélioré", true);
                return { ...prev, quantumShards: prev.quantumShards - upgrade.cost, purchasedCoreUpgrades: [...prev.purchasedCoreUpgrades, id] };
            }
            return prev;
        });
        return success;
    }, [setGameState, checkAchievement]);

    const dischargeCore = useCallback((): boolean => {
        let success = false;
        setGameState(prev => {
            if (prev.coreCharge >= 100 && !prev.isCoreDischarging) {
                success = true;
                const { coreBonuses } = getComputed(prev);
                if (dischargeTimer.current) clearTimeout(dischargeTimer.current);
                dischargeTimer.current = window.setTimeout(() => {
                    setGameState(p => ({ ...p, isCoreDischarging: false }));
                    dischargeTimer.current = null;
                }, coreBonuses.duration);
                return { ...prev, isCoreDischarging: true, coreCharge: 0 };
            }
            return prev;
        });
        return success;
    }, [setGameState]);

    const setHasSeenCoreTutorial = useCallback((seen: boolean) => {
        setGameState(prev => ({ ...prev, hasSeenCoreTutorial: seen }));
    }, [setGameState]);
    
    return {
        getComputed,
        productionTotal: (state: GameState) => getComputed(state).productionTotal,
        maxEnergy: (state: GameState) => getComputed(state).maxEnergy,
        canAscend: (state: GameState) => getComputed(state).canAscend,
        calculateCoreCharge: (state: GameState) => {
            const { coreBonuses, achievementBonuses } = getComputed(state);
            let newCoreCharge = state.coreCharge;
            if (!state.isCoreDischarging && newCoreCharge < 100) {
                const chargeRate = (CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge) / (1000 / TICK_RATE);
                newCoreCharge = Math.min(100, newCoreCharge + chargeRate);
            }
            return newCoreCharge;
        },
        actions: { doAscension, buyAscensionUpgrade, buyCoreUpgrade, dischargeCore, setHasSeenCoreTutorial },
    };
};
