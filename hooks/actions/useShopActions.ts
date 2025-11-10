import { useCallback } from 'react';
import { GameState } from '../../types';
import { SHOP_UPGRADES } from '../../constants';

export const useShopActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gameState: GameState,
) => {
    const buyShopUpgrade = useCallback((id: string): boolean => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === id);
        if (!upgrade) return false;

        let success = false;

        setGameState(prev => {
            const isPurchased = prev.purchasedShopUpgrades.includes(id);
            if (isPurchased) return prev;

            let canAfford = false;
            if (upgrade.currency === 'quantumShards') {
                canAfford = prev.quantumShards >= upgrade.cost;
            }

            if (canAfford) {
                success = true;
                const newShopUpgrades = [...prev.purchasedShopUpgrades, id];
                let newQuantumShards = prev.quantumShards;

                if (upgrade.currency === 'quantumShards') {
                    newQuantumShards -= upgrade.cost;
                }
                
                return {
                    ...prev,
                    purchasedShopUpgrades: newShopUpgrades,
                    quantumShards: newQuantumShards,
                };
            }

            return prev;
        });

        return success;
    }, [setGameState]);

    return { buyShopUpgrade };
};