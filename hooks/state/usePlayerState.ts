import { useCallback } from 'react';
import { GameState } from '../../types';
// FIX: Import missing constants to resolve reference errors.
import { MAX_UPGRADE_LEVEL, ASCENSION_UPGRADES } from '../../constants';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';

type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const usePlayerState = (setGameState: SetGameStateFn, checkAchievement: CheckAchievementFn) => {
    
    const incrementClickCount = useCallback((clickPower: number) => {
        let newEnergy = 0;
        setGameState(prev => {
            const newTotalClicks = prev.totalClicks + 1;
            checkAchievement("Frénésie du Clic", newTotalClicks >= 1000);
            checkAchievement("Tempête de Clics", newTotalClicks >= 100000);
            
            const maxEnergy = 1e9 * Math.pow(10, prev.ascensionLevel); // Recalculate locally to avoid stale closures
            newEnergy = Math.min(prev.energy + clickPower, maxEnergy);
            
            return { ...prev, totalClicks: newTotalClicks, energy: newEnergy };
        });
        return newEnergy;
    }, [setGameState, checkAchievement]);

    const buyUpgrade = useCallback((index: number, amount: number | 'MAX'): boolean => {
        let success = false;
        
        setGameState(prev => {
            const costMultiplier = prev.purchasedAscensionUpgrades.reduce((acc, id) => {
                const upg = ASCENSION_UPGRADES.find(u => u.id === id);
                if (upg?.effect.type === 'COST_REDUCTION') return acc - upg.effect.value;
                return acc;
            }, 1) * prev.achievements.filter(a => a.unlocked && a.bonus.type === 'COST_REDUCTION').reduce((acc, a) => acc * (1 - a.bonus.value / 100), 1);

            const upgrade = prev.upgrades[index];
            if (upgrade.owned >= MAX_UPGRADE_LEVEL) return prev;

            const { numToBuy, totalCost } = calculateBulkBuy(upgrade, amount, prev.energy, costMultiplier);
            
            if (numToBuy === 0) return prev;

            success = true;

            const newUpgrades = [...prev.upgrades];
            const newUpgrade = { ...newUpgrades[index] };
            newUpgrade.owned += numToBuy;
            newUpgrade.currentCost = calculateCost(newUpgrade.baseCost, newUpgrade.owned, costMultiplier);
            newUpgrades[index] = newUpgrade;

            return { ...prev, energy: prev.energy - totalCost, upgrades: newUpgrades };
        });

        return success;
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
        },
        getComputed,
    };
};