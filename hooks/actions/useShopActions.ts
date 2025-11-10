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

        const isPurchased = gameState.purchasedShopUpgrades.includes(id);
        if (isPurchased) return false;

        let canAfford = false;
        if (upgrade.currency === 'quantumShards') {
            canAfford = gameState.quantumShards >= upgrade.cost;
        }

        if (canAfford) {
            setGameState(prev => {
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
            });
            return true;
        }

        return false;
    }, [gameState.purchasedShopUpgrades, gameState.quantumShards, setGameState]);

    return { buyShopUpgrade };
};
