import { useCallback } from 'react';
import { GameState } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';

export const usePlayerActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    // gameState is no longer directly used in the actions, but the hook signature can remain for compatibility if needed elsewhere.
    gameState: GameState,
    costMultiplier: number,
    checkAchievement: (name: string, condition: boolean) => void
) => {
    const incrementClickCount = useCallback(() => {
        setGameState(prev => {
            const newTotalClicks = prev.totalClicks + 1;
            checkAchievement("Frénésie du Clic", newTotalClicks >= 1000);
            checkAchievement("Tempête de Clics", newTotalClicks >= 100000);
            return { ...prev, totalClicks: newTotalClicks };
        });
    }, [setGameState, checkAchievement]);

    const buyUpgrade = useCallback((index: number, amount: number | 'MAX'): boolean => {
        let success = false;
        
        setGameState(prev => {
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
    }, [costMultiplier, setGameState]);

    return {
        incrementClickCount,
        buyUpgrade,
    };
};