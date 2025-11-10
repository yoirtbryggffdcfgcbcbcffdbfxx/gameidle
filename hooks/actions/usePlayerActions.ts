import { useCallback } from 'react';
import { GameState } from '../../types';
import { MAX_UPGRADE_LEVEL } from '../../constants';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';

export const usePlayerActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gameState: GameState,
    costMultiplier: number,
    checkAchievement: (name: string, condition: boolean) => void
) => {
    const incrementClickCount = useCallback(() => {
        setGameState(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
        // La vérification du succès utilise la valeur gameState de la portée pour vérifier la condition AVANT la mise à jour de l'état.
        checkAchievement("Frénésie du Clic", gameState.totalClicks + 1 >= 1000);
        checkAchievement("Tempête de Clics", gameState.totalClicks + 1 >= 100000);
    }, [setGameState, checkAchievement, gameState.totalClicks]);

    const buyUpgrade = useCallback((index: number, amount: number | 'MAX'): boolean => {
        const upgrade = gameState.upgrades[index];
        if (upgrade.owned >= MAX_UPGRADE_LEVEL) return false;

        const { numToBuy, totalCost } = calculateBulkBuy(upgrade, amount, gameState.energy, costMultiplier);
        
        if (numToBuy === 0) return false;

        setGameState(prev => {
            const newUpgrades = [...prev.upgrades];
            const newUpgrade = { ...newUpgrades[index] };
            newUpgrade.owned += numToBuy;
            newUpgrade.currentCost = calculateCost(newUpgrade.baseCost, newUpgrade.owned, costMultiplier);
            newUpgrades[index] = newUpgrade;
            return { ...prev, energy: prev.energy - totalCost, upgrades: newUpgrades };
        });

        return true;
    }, [gameState.upgrades, gameState.energy, costMultiplier, setGameState]);

    return {
        incrementClickCount,
        buyUpgrade,
    };
};
