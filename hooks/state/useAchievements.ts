// hooks/state/useAchievements.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState, Achievement } from '../../types';
import { INITIAL_ACHIEVEMENTS } from '../../data/achievements';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type OnAchievementUnlockFn = (achievement: Achievement) => void;

/**
 * A pure function to check for and unlock an achievement.
 * It doesn't cause side effects (like calling setGameState).
 * It returns the updated list of achievements and the newly unlocked one, if any.
 */
export const checkAndUnlockAchievement = (
    achievements: Achievement[], 
    name: string, 
    condition: boolean
): { updatedAchievements: Achievement[], unlocked: Achievement | null } => {
    if (!condition) return { updatedAchievements: achievements, unlocked: null };
    
    const achievement = achievements.find(a => a.name === name);
    if (achievement && !achievement.unlocked) {
        const unlockedAchievement = {...achievement, unlocked: true};
        const newAchievements = achievements.map(a => a.name === name ? unlockedAchievement : a);
        return { updatedAchievements: newAchievements, unlocked: unlockedAchievement };
    }
    
    return { updatedAchievements: achievements, unlocked: null };
};


export const useAchievements = (setGameState: SetGameStateFn, onAchievementUnlock: OnAchievementUnlockFn) => {
    
    const checkAchievement = useCallback((name: string, condition: boolean) => {
        if (!condition) return;
        setGameState(prev => {
            const { updatedAchievements, unlocked } = checkAndUnlockAchievement(prev.achievements, name, condition);
            if (unlocked) {
                onAchievementUnlock(unlocked);
                return { ...prev, achievements: updatedAchievements };
            }
            return prev;
        });
    }, [setGameState, onAchievementUnlock]);

    const checkAll = useCallback((gameState: GameState, productionTotal: number, maxEnergy: number) => {
        checkAchievement(ACHIEVEMENT_IDS.IGNITION, gameState.energy >= 1000);
        checkAchievement(ACHIEVEMENT_IDS.STELLAR_FUSION, gameState.energy >= 100000);
        checkAchievement(ACHIEVEMENT_IDS.EVENT_HORIZON, gameState.energy >= 10000000);
        checkAchievement(ACHIEVEMENT_IDS.QUANTUM_BILLIONAIRE, gameState.energy >= 1000000000);
        checkAchievement(ACHIEVEMENT_IDS.ENERGY_DEITY, gameState.energy >= maxEnergy);
        checkAchievement(ACHIEVEMENT_IDS.STEADY_FLOW, productionTotal >= 1000);
        checkAchievement(ACHIEVEMENT_IDS.FULL_AUTOMATION, productionTotal >= 100000);
        checkAchievement(ACHIEVEMENT_IDS.INFINITY_ENGINE, productionTotal >= 1e7);
        checkAchievement(ACHIEVEMENT_IDS.SINGULARITY_UNLEASHED, productionTotal >= 1e9);
        const totalUpgradesOwned = gameState.upgrades.reduce((sum, u) => sum + u.owned, 0);
        checkAchievement(ACHIEVEMENT_IDS.EMPIRE_PRIMER, totalUpgradesOwned >= 50);
        checkAchievement(ACHIEVEMENT_IDS.INDUSTRIAL_ARCHITECT, totalUpgradesOwned >= 250);
        checkAchievement(ACHIEVEMENT_IDS.TECH_TYCOON, totalUpgradesOwned >= 750);
        checkAchievement(ACHIEVEMENT_IDS.GALACTIC_SOVEREIGN, totalUpgradesOwned >= 1500);
        const galacCollector = gameState.upgrades.find(u => u.name === "Collecteur Galactique Theta");
        if (galacCollector) checkAchievement(ACHIEVEMENT_IDS.COSMIC_COLLECTOR, galacCollector.owned >= 100);
    }, [checkAchievement]);

    const unlockAchievement = useCallback((name: string) => {
        checkAchievement(name, true);
    }, [checkAchievement]);

    const dev_unlockAll = useCallback(() => setGameState(prev => ({ ...prev, achievements: prev.achievements.map(a => ({...a, unlocked: true}))})), [setGameState]);
    const dev_reset = useCallback(() => setGameState(prev => ({ ...prev, achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a}))})), [setGameState]);

    return {
        checkAchievement,
        checkAll,
        unlockAchievement,
        dev_unlockAll,
        dev_reset,
    };
};