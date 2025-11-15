// hooks/state/usePrestigeState.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback, useRef, useEffect } from 'react';
import { GameState } from '../../types';
// FIX: Import missing constants and helpers to resolve reference errors.
import { ASCENSION_UPGRADES } from '../../data/ascension';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { getInitialState } from '../../utils/helpers';
import { calculateAscensionBonuses, calculateAchievementBonuses } from '../../utils/bonusCalculations';
import { calculateProduction, calculateCanAscend } from '../../utils/gameplayCalculations';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';


type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type ResetViewedCategoriesFn = () => void;

export const usePrestigeState = (
    setGameState: SetGameStateFn,
    checkAchievement: CheckAchievementFn,
    resetViewedCategories: ResetViewedCategoriesFn
) => {
    const lastKnownNewUpgradeCount = useRef(0);

    const getComputed = useCallback((gameState: GameState) => {
        const ascensionBonuses = calculateAscensionBonuses(gameState.purchasedAscensionUpgrades);
        const achievementBonuses = calculateAchievementBonuses(gameState.achievements);
        
        const costMultiplier = ascensionBonuses.costReduction * achievementBonuses.costReduction;
        
        const production = calculateProduction(gameState, ascensionBonuses, achievementBonuses, { chargeRate: 1, multiplier: 1, duration: 0 }); // Core bonus is handled separately

        const maxEnergy = 1e9 * Math.pow(10, gameState.ascensionLevel);
        const unlockedUpgradesForCurrentAscension = gameState.upgrades.filter(u => u.requiredAscension <= gameState.ascensionLevel);
        const unlockedUpgradesAtMaxLevelCount = unlockedUpgradesForCurrentAscension.filter(u => u.owned >= MAX_UPGRADE_LEVEL).length;
        
        const { canAscend, ascensionGain } = calculateCanAscend(
            gameState.ascensionLevel,
            gameState.energy,
            maxEnergy,
            unlockedUpgradesAtMaxLevelCount,
            unlockedUpgradesForCurrentAscension.length
        );

        const visibleUpgrades = gameState.upgrades
            .map((upgradeData, originalIndex) => ({ upgradeData, originalIndex }))
            .filter(({ upgradeData }) => upgradeData.unlockCost <= gameState.totalEnergyProduced || upgradeData.owned > 0)
            .filter(({ upgradeData }) => upgradeData.requiredAscension <= gameState.ascensionLevel);

        const newlyVisibleUpgradeIds = visibleUpgrades
            .map(u => u.upgradeData.id)
            .filter(id => !gameState.seenUpgrades.includes(id));

        const newlyVisibleUpgradeTypes = new Set<string>();
        if (newlyVisibleUpgradeIds.length > 0) {
            const newUpgrades = visibleUpgrades.filter(u => newlyVisibleUpgradeIds.includes(u.upgradeData.id));
            newUpgrades.forEach(u => newlyVisibleUpgradeTypes.add(u.upgradeData.type));
        }

        return {
            ascensionBonuses,
            achievementBonuses,
            costMultiplier,
            productionTotal: production.productionTotal,
            maxEnergy,
            canAscend,
            ascensionGain,
            visibleUpgrades,
            unlockedUpgradesAtMaxLevelCount,
            unlockedUpgradesForCurrentAscensionCount: unlockedUpgradesForCurrentAscension.length,
            newlyVisibleUpgradeIds,
            newlyVisibleUpgradeTypes,
        };
    }, []);

    // Effect to reset viewed categories when new upgrades appear
    useEffect(() => {
        setGameState(prev => {
            const { newlyVisibleUpgradeIds } = getComputed(prev);
            if (newlyVisibleUpgradeIds.length > 0 && lastKnownNewUpgradeCount.current === 0) {
                // New upgrades just appeared, reset the viewed tabs
                lastKnownNewUpgradeCount.current = newlyVisibleUpgradeIds.length;
                return { ...prev, viewedCategories: [] };
            } else if (newlyVisibleUpgradeIds.length === 0 && lastKnownNewUpgradeCount.current > 0) {
                // All new upgrades have been seen, reset the counter for the next batch
                lastKnownNewUpgradeCount.current = 0;
            }
            return prev;
        });
    }, [setGameState, getComputed]);


    const doAscension = useCallback((): boolean => {
        let success = false;
        setGameState(prev => {
            const { canAscend, ascensionGain, ascensionBonuses } = getComputed(prev);
            if (!canAscend) return prev;

            success = true;
            const nextAscensionLevel = prev.ascensionLevel + 1;
            checkAchievement(ACHIEVEMENT_IDS.TRANSCENDENCE, nextAscensionLevel >= 5);
            checkAchievement(ACHIEVEMENT_IDS.MULTIVERSE_MASTER, nextAscensionLevel >= 10);
            checkAchievement(ACHIEVEMENT_IDS.ETERNAL_LEGEND, nextAscensionLevel >= 25);
            
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
                seenUpgrades: [],
                viewedCategories: [],
                isShopUnlocked: prev.isShopUnlocked,
                isCoreUnlocked: prev.isCoreUnlocked,
                chosenQuantumPath: null,
                quantumPathLevel: 0,
            };
        });
        if (success) {
            resetViewedCategories();
        }
        return success;
    }, [setGameState, checkAchievement, resetViewedCategories, getComputed]);
    
    const buyAscensionUpgrade = useCallback((id: string): boolean => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;
        let success = false;
        setGameState(prev => {
            if (prev.ascensionPoints >= upgrade.cost && !prev.purchasedAscensionUpgrades.includes(id) && upgrade.required.every(req => prev.purchasedAscensionUpgrades.includes(req))) {
                success = true;
                if (prev.purchasedAscensionUpgrades.length === 1) checkAchievement(ACHIEVEMENT_IDS.FIRST_TRANSCENDENCE, true);
                return { ...prev, ascensionPoints: prev.ascensionPoints - upgrade.cost, purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, id] };
            }
            return prev;
        });
        return success;
    }, [setGameState, checkAchievement]);
    
    return {
        getComputed,
        actions: { doAscension, buyAscensionUpgrade },
    };
};
