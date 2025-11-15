// hooks/state/usePlayerState.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { ASCENSION_UPGRADES } from '../../data/ascension';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const usePlayerState = (setGameState: SetGameStateFn, checkAchievement: CheckAchievementFn) => {
    
    const buyUpgrade = useCallback((index: number, amount: number | 'MAX'): void => {
        setGameState(prev => {
            const costReductionFromAscension = prev.purchasedAscensionUpgrades.reduce((acc, id) => {
                const upg = ASCENSION_UPGRADES.find(u => u.id === id);
                if (upg?.effect.type === 'COST_REDUCTION') return acc + upg.effect.value;
                return acc;
            }, 0);

            const costReductionFromAchievements = prev.achievements
                .filter(a => a.unlocked && a.bonus.type === 'COST_REDUCTION')
                .reduce((acc, a) => acc * (1 - a.bonus.value / 100), 1);
            
            const costMultiplier = (1 - costReductionFromAscension) * costReductionFromAchievements;

            const upgrade = prev.upgrades[index];
            if (upgrade.owned >= MAX_UPGRADE_LEVEL) return prev;

            const { numLevelsBought, tiersBought, totalCost, newBaseCost, nextLevelCostOverride } = calculateBulkBuy(upgrade, amount, prev.energy, costMultiplier);
            
            if (numLevelsBought === 0 && tiersBought === 0) return prev;

            const newUpgrades = [...prev.upgrades];
            const newUpgrade = { ...newUpgrades[index] };
            
            newUpgrade.owned += numLevelsBought;
            newUpgrade.tier += tiersBought;
            
            // If a new base cost was calculated (after a discount), update it.
            if (newBaseCost !== undefined) {
                newUpgrade.baseCost = newBaseCost;
            }
            
            // The nextLevelCostOverride is either the new discount if only a tier was bought,
            // or undefined if a level was bought (consuming the discount) or no tier was involved.
            newUpgrade.nextLevelCostOverride = nextLevelCostOverride;


            // Recalcule le coût actuel pour le prochain niveau.
            newUpgrade.currentCost = calculateCost(newUpgrade.baseCost, newUpgrade.owned, costMultiplier, newUpgrade.nextLevelCostOverride);
            newUpgrades[index] = newUpgrade;

            const totalUpgradesOwned = newUpgrades.reduce((sum, u) => sum + u.owned, 0);
            checkAchievement(ACHIEVEMENT_IDS.EMPIRE_PRIMER, totalUpgradesOwned >= 50);
            checkAchievement(ACHIEVEMENT_IDS.INDUSTRIAL_ARCHITECT, totalUpgradesOwned >= 250);
            checkAchievement(ACHIEVEMENT_IDS.TECH_TYCOON, totalUpgradesOwned >= 750);
            checkAchievement(ACHIEVEMENT_IDS.GALACTIC_SOVEREIGN, totalUpgradesOwned >= 1500);

            // Mark the upgrade as "seen" upon purchase
            const newSeenUpgrades = prev.seenUpgrades.includes(upgrade.id) 
                ? prev.seenUpgrades 
                : [...prev.seenUpgrades, upgrade.id];

            return { 
                ...prev, 
                energy: prev.energy - totalCost, 
                upgrades: newUpgrades,
                seenUpgrades: newSeenUpgrades,
            };
        });
    }, [setGameState, checkAchievement]);
    
    const buyTierUpgrade = useCallback((index: number) => {
        setGameState(prev => {
            const upgrade = prev.upgrades[index];
            if (upgrade.owned % 10 !== 0 || upgrade.owned === 0 || upgrade.owned >= MAX_UPGRADE_LEVEL) {
                return prev;
            }

            const costReductionFromAscension = prev.purchasedAscensionUpgrades.reduce((acc, id) => {
                const upg = ASCENSION_UPGRADES.find(u => u.id === id);
                if (upg?.effect.type === 'COST_REDUCTION') return acc + upg.effect.value;
                return acc;
            }, 0);
            const costReductionFromAchievements = prev.achievements
                .filter(a => a.unlocked && a.bonus.type === 'COST_REDUCTION')
                .reduce((acc, a) => acc * (1 - a.bonus.value / 100), 1);
            const costMultiplier = (1 - costReductionFromAscension) * costReductionFromAchievements;

            const tierUpgradeCost = calculateCost(upgrade.baseCost, upgrade.owned, costMultiplier) * 10;

            if (prev.energy < tierUpgradeCost) {
                return prev;
            }

            const newUpgrades = [...prev.upgrades];
            const newUpgrade = { ...newUpgrades[index] };
            
            newUpgrade.tier += 1;
            
            const discountedNextCost = Math.floor(tierUpgradeCost * 0.9);
            newUpgrade.nextLevelCostOverride = discountedNextCost;

            newUpgrade.currentCost = discountedNextCost;
            
            newUpgrades[index] = newUpgrade;
            
            return {
                ...prev,
                energy: prev.energy - tierUpgradeCost,
                upgrades: newUpgrades,
            };
        });
    }, [setGameState]);


    const markCategoryAsViewed = useCallback((category: string) => {
        setGameState(prev => {
            if (prev.viewedCategories.includes(category) || category === 'all') {
                return prev;
            }
            return { ...prev, viewedCategories: [...prev.viewedCategories, category] };
        });
    }, [setGameState]);

    const resetViewedCategories = useCallback(() => {
        setGameState(prev => ({ ...prev, viewedCategories: [] }));
    }, [setGameState]);

    const getComputed = (gameState: GameState) => {
        const clickPowerFromUpgrades = gameState.upgrades
            .filter(u => u.type === 'CLICK')
            .reduce((sum, u) => sum + (u.baseProduction * Math.pow(2, u.tier)) * u.owned, 0);

        return { clickPowerFromUpgrades };
    };

    return {
        actions: {
            buyUpgrade,
            buyTierUpgrade, // Expose the new action
            markCategoryAsViewed,
            resetViewedCategories,
        },
        getComputed,
    };
};