// hooks/state/useAchievements.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState, Achievement } from '../../types';
import { INITIAL_ACHIEVEMENTS } from '../../data/achievements';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type OnAchievementUnlockFn = (achievement: Achievement) => void;

export const useAchievements = (setGameState: SetGameStateFn, onAchievementUnlock: OnAchievementUnlockFn) => {
    
    const checkAchievement = useCallback((name: string, condition: boolean) => {
        if (!condition) return;
        setGameState(prev => {
            const achievement = prev.achievements.find(a => a.name === name);
            if (achievement && !achievement.unlocked) {
                const unlockedAchievement = {...achievement, unlocked: true};
                onAchievementUnlock(unlockedAchievement);
                return { ...prev, achievements: prev.achievements.map(a => a.name === name ? unlockedAchievement : a) };
            }
            return prev;
        });
    }, [setGameState, onAchievementUnlock]);

    const checkAll = useCallback((gameState: GameState, productionTotal: number, maxEnergy: number) => {
        checkAchievement("Allumage", gameState.energy >= 1000);
        checkAchievement("Fusion Stellaire", gameState.energy >= 100000);
        checkAchievement("Horizon des Événements", gameState.energy >= 10000000);
        checkAchievement("Milliardaire Quantique", gameState.energy >= 1000000000);
        checkAchievement("Divinité Énergétique", gameState.energy >= maxEnergy);
        checkAchievement("Flux Constant", productionTotal >= 1000);
        checkAchievement("Automatisation Complète", productionTotal >= 100000);
        checkAchievement("Moteur de l'Infini", productionTotal >= 1e7);
        checkAchievement("Singularité Déchaînée", productionTotal >= 1e9);
        const totalUpgradesOwned = gameState.upgrades.reduce((sum, u) => sum + u.owned, 0);
        checkAchievement("Amorce d'Empire", totalUpgradesOwned >= 50);
        checkAchievement("Architecte Industriel", totalUpgradesOwned >= 250);
        checkAchievement("Magnat de la Technologie", totalUpgradesOwned >= 750);
        checkAchievement("Souverain Galactique", totalUpgradesOwned >= 1500);
        const galacCollector = gameState.upgrades.find(u => u.name === "Collecteur Galactique Theta");
        if (galacCollector) checkAchievement("Collectionneur Cosmique", galacCollector.owned >= 100);
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
