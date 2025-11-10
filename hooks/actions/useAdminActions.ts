import { useCallback } from 'react';
import { GameState } from '../../types';
import { SAVE_KEY, MAX_UPGRADE_LEVEL } from '../../constants';
import { INITIAL_ACHIEVEMENTS } from '../../data/achievements';
// FIX: Corrected import path for `getInitialState`. It is exported from `utils/helpers.ts`, not `useGameState.ts`.
import { getInitialState } from '../../utils/helpers';

export const useAdminActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setHasSaveData: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const resetGame = useCallback((hardReset: boolean) => {
        if (hardReset) {
            localStorage.removeItem(SAVE_KEY);
        }
        setGameState(getInitialState());
        setHasSaveData(false);
    }, [setGameState, setHasSaveData]);

    const dev_setEnergy = useCallback((amount: number) => {
        setGameState(prev => ({
            ...prev,
            energy: amount,
            totalEnergyProduced: Math.max(prev.totalEnergyProduced, amount),
        }));
    }, [setGameState]);

    const dev_addEnergy = useCallback((amount: number) => {
        setGameState(prev => ({
            ...prev,
            energy: prev.energy + amount,
            totalEnergyProduced: prev.totalEnergyProduced + amount,
        }));
    }, [setGameState]);

    const dev_addAscension = useCallback(() => setGameState(prev => ({ ...prev, ascensionLevel: prev.ascensionLevel + 1, ascensionPoints: prev.ascensionPoints + 10 })), [setGameState]);
    const dev_unlockAllUpgrades = useCallback(() => setGameState(prev => ({ ...prev, upgrades: prev.upgrades.map(u => ({...u, owned: Math.min(MAX_UPGRADE_LEVEL, u.owned + 10)}))})), [setGameState]);
    const dev_unlockAllAchievements = useCallback(() => setGameState(prev => ({ ...prev, achievements: prev.achievements.map(a => ({...a, unlocked: true}))})), [setGameState]);
    const dev_resetAchievements = useCallback(() => setGameState(prev => ({ ...prev, achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a}))})), [setGameState]);

    return {
        resetGame,
        dev_setEnergy,
        dev_addEnergy,
        dev_addAscension,
        dev_unlockAllUpgrades,
        dev_unlockAllAchievements,
        dev_resetAchievements,
    };
};