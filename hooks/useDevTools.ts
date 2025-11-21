
import React, { useCallback } from 'react';
import { GameState } from '../types';
import { MAX_UPGRADE_LEVEL } from '../constants';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

interface DevToolsDeps {
    setGameState: SetGameStateFn;
    achievementsManager: {
        dev_unlockAll: () => void;
        dev_reset: () => void;
    };
    prestigeActions: {
        doAscension: () => boolean;
    };
}

export const useDevTools = ({ setGameState, achievementsManager, prestigeActions }: DevToolsDeps) => {

    const dev_setEnergy = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, energy: amount, totalEnergyProduced: Math.max(prev.totalEnergyProduced, amount)}));
    }, [setGameState]);

    const dev_addEnergy = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, energy: prev.energy + amount, totalEnergyProduced: prev.totalEnergyProduced + amount }));
    }, [setGameState]);

    const dev_addLevelsToAllUpgrades = useCallback((levels: number) => {
        setGameState(prev => {
            const newUpgrades = prev.upgrades.map(u => {
                const isVisible = u.unlockCost <= prev.totalEnergyProduced || u.owned > 0;
                if (isVisible) {
                    return { ...u, owned: Math.min(u.owned + levels, MAX_UPGRADE_LEVEL) };
                }
                return u;
            });
            return { ...prev, upgrades: newUpgrades };
        });
    }, [setGameState]);

    const dev_setCoreCharge = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, coreCharge: Math.min(amount, 100) }));
    }, [setGameState]);

    const dev_addShards = useCallback((amount: number) => {
        setGameState(prev => ({ ...prev, quantumShards: prev.quantumShards + amount }));
    }, [setGameState]);

    const dev_unlockFeature = useCallback((feature: 'shop' | 'core' | 'bank') => {
        setGameState(prev => {
            switch (feature) {
                case 'shop':
                    return { ...prev, isShopUnlocked: true, hasUnseenShopItems: true };
                case 'core':
                    return { ...prev, isCoreUnlocked: true };
                case 'bank':
                    return { ...prev, isBankUnlocked: true, isBankDiscovered: true };
                default:
                    return prev;
            }
        });
    }, [setGameState]);

    const dev_addAscensionLevel = useCallback((levels: number, points: number) => {
        setGameState(prev => ({
            ...prev,
            ascensionLevel: prev.ascensionLevel + levels,
            ascensionPoints: prev.ascensionPoints + points,
        }));
    }, [setGameState]);

    return {
        setEnergy: dev_setEnergy,
        addEnergy: dev_addEnergy,
        unlockAllAchievements: achievementsManager.dev_unlockAll,
        resetAchievements: achievementsManager.dev_reset,
        doAscension: prestigeActions.doAscension,
        addLevelsToAllUpgrades: dev_addLevelsToAllUpgrades,
        setCoreCharge: dev_setCoreCharge,
        addShards: dev_addShards,
        unlockFeature: dev_unlockFeature,
        addAscensionLevel: dev_addAscensionLevel,
    };
};
