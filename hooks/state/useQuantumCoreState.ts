// hooks/state/useQuantumCoreState.ts
import React, { useCallback } from 'react';
import { GameState, QuantumPathType } from '../../types';
import { QUANTUM_PATHS } from '../../data/quantumPaths';
// FIX: Import CORE_UPGRADES to be used in the new buyCoreUpgrade action.
import { CORE_UPGRADES } from '../../data/core';

type CheckAchievementFn = (name: string, condition: boolean) => void;
type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useQuantumCoreState = (setGameState: SetGameStateFn, checkAchievement: CheckAchievementFn) => {
    
    const setQuantumPath = useCallback((path: QuantumPathType) => {
        setGameState(prev => {
            if (prev.chosenQuantumPath) return prev; // Path can only be chosen once
            return {
                ...prev,
                chosenQuantumPath: path,
                quantumPathLevel: 0,
            };
        });
    }, [setGameState]);

    const purchasePathUpgrade = useCallback(() => {
        let success = false;
        setGameState(prev => {
            if (!prev.chosenQuantumPath) return prev;

            const pathData = QUANTUM_PATHS[prev.chosenQuantumPath];
            if (prev.quantumPathLevel >= pathData.upgrades.length) {
                return prev; // Max level reached
            }

            const nextUpgrade = pathData.upgrades.find(u => u.level === prev.quantumPathLevel + 1);
            if (!nextUpgrade || prev.quantumShards < nextUpgrade.cost) {
                return prev;
            }
            
            success = true;
            return {
                ...prev,
                quantumShards: prev.quantumShards - nextUpgrade.cost,
                quantumPathLevel: prev.quantumPathLevel + 1,
            };
        });
        return success;
    }, [setGameState]);

    // FIX: Add an action to handle purchasing core upgrades from the Reactor skill tree.
    const buyCoreUpgrade = useCallback((id: string): boolean => {
        const upgrade = CORE_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;
        let success = false;
        setGameState(prev => {
            if (
                prev.quantumShards >= upgrade.cost &&
                !prev.purchasedCoreUpgrades.includes(id) &&
                upgrade.required.every(req => prev.purchasedCoreUpgrades.includes(req))
            ) {
                success = true;
                return {
                    ...prev,
                    quantumShards: prev.quantumShards - upgrade.cost,
                    purchasedCoreUpgrades: [...prev.purchasedCoreUpgrades, id]
                };
            }
            return prev;
        });
        return success;
    }, [setGameState]);

    const markQuantumCoreAsInteracted = useCallback(() => {
        setGameState(prev => {
            if (prev.hasInteractedWithQuantumCore) return prev;
            return { ...prev, hasInteractedWithQuantumCore: true };
        });
    }, [setGameState]);

    return {
        actions: {
            setQuantumPath,
            purchasePathUpgrade,
            markQuantumCoreAsInteracted,
            buyCoreUpgrade,
        },
    };
};