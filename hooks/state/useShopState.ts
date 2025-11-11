import { useCallback } from 'react';
import { GameState } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useShopState = (setGameState: SetGameStateFn) => {
    
    const buyShopUpgrade = useCallback((id: string): void => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === id);
        if (!upgrade) return;

        setGameState(prev => {
            if (prev.purchasedShopUpgrades.includes(id)) {
                return prev;
            }

            const canAfford = upgrade.currency === 'energy'
                ? prev.energy >= upgrade.cost
                : prev.quantumShards >= upgrade.cost;
            
            if (canAfford) {
                const newEnergy = upgrade.currency === 'energy' ? prev.energy - upgrade.cost : prev.energy;
                const newShards = upgrade.currency === 'quantumShards' ? prev.quantumShards - upgrade.cost : prev.quantumShards;

                return {
                    ...prev,
                    energy: newEnergy,
                    quantumShards: newShards,
                    purchasedShopUpgrades: [...prev.purchasedShopUpgrades, id],
                };
            }
            return prev;
        });
    }, [setGameState]);
    
    return {
        actions: {
            buyShopUpgrade,
        },
    };
};