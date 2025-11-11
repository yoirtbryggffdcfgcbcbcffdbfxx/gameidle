// hooks/state/usePlayerState.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { ASCENSION_UPGRADES } from '../../data/ascension';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';

type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const usePlayerState = (setGameState: SetGameStateFn, checkAchievement: CheckAchievementFn) => {
    
    const incrementClickCount = useCallback((clickPower: number) => {
        setGameState(prev => {
            const newTotalClicks = prev.totalClicks + 1;
            checkAchievement("Frénésie du Clic", newTotalClicks >= 1000);
            checkAchievement("Tempête de Clics", newTotalClicks >= 100000);
            
            // Recalculate maxEnergy locally to avoid stale closures from props/arguments.
            const maxEnergy = 1e9 * Math.pow(10, prev.ascensionLevel); 
            const newEnergy = Math.min(prev.energy + clickPower, maxEnergy);
            
            return { ...prev, totalClicks: newTotalClicks, energy: newEnergy };
        });
    }, [setGameState, checkAchievement]);

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

            const { numToBuy, totalCost } = calculateBulkBuy(upgrade, amount, prev.energy, costMultiplier);
            
            if (numToBuy === 0) return prev;

            const newUpgrades = [...prev.upgrades];
            const newUpgrade = { ...newUpgrades[index] };
            newUpgrade.owned += numToBuy;
            newUpgrade.currentCost = calculateCost(newUpgrade.baseCost, newUpgrade.owned, costMultiplier);
            newUpgrades[index] = newUpgrade;

            const totalUpgradesOwned = newUpgrades.reduce((sum, u) => sum + u.owned, 0);
            checkAchievement("Amorce d'Empire", totalUpgradesOwned >= 50);
            checkAchievement("Architecte Industriel", totalUpgradesOwned >= 250);
            checkAchievement("Magnat de la Technologie", totalUpgradesOwned >= 750);
            checkAchievement("Souverain Galactique", totalUpgradesOwned >= 1500);

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
            .reduce((sum, u) => sum + u.production * u.owned, 0);

        return { clickPowerFromUpgrades };
    };

    return {
        actions: {
            incrementClickCount,
            buyUpgrade,
            markCategoryAsViewed,
            resetViewedCategories,
        },
        getComputed,
    };
};
