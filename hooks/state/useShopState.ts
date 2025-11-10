import { useCallback } from 'react';
import { GameState } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useShopState = (setGameState: SetGameStateFn) => {
    
    const buyShopUpgrade = useCallback((id: string): boolean => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === id);
        if (!upgrade) return false;

        let success = false;
        setGameState(prev => {
            const isPurchased = prev.purchasedShopUpgrades.includes(id);
            if (isPurchased) return prev;

            let canAfford = prev.quantumShards >= upgrade.cost;
            if (canAfford) {
                success = true;
                return {
                    ...prev,
                    purchasedShopUpgrades: [...prev.purchasedShopUpgrades, id],
                    quantumShards: prev.quantumShards - upgrade.cost,
                };
            }
            return prev;
        });
        return success;
    }, [setGameState]);

    return {
        actions: { buyShopUpgrade }
    };
};
