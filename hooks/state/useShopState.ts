// hooks/state/useShopState.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState } from '../../types';
import { SHOP_UPGRADES } from '../../data/shop';
import { getNextFragmentCost } from '../../data/quantumFragments';

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

    const buyQuantumShard = useCallback((): void => {
        setGameState(prev => {
            if (!prev.isCoreUnlocked) return prev; // Safety check
            
            const cost = getNextFragmentCost(prev.quantumShards);
            if (prev.energy >= cost) {
                return {
                    ...prev,
                    energy: prev.energy - cost,
                    quantumShards: prev.quantumShards + 1,
                };
            }
            return prev;
        });
    }, [setGameState]);

    const markShopItemsAsSeen = useCallback(() => {
        setGameState(prev => {
            if (prev.hasUnseenShopItems) {
                return { ...prev, hasUnseenShopItems: false };
            }
            return prev;
        });
    }, [setGameState]);
    
    return {
        actions: {
            buyShopUpgrade,
            buyQuantumShard,
            markShopItemsAsSeen,
        },
    };
};