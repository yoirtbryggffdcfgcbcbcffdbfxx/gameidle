// hooks/useTutorialTriggers.ts
// FIX: Import React to provide namespace for types.
import React, { useEffect } from 'react';
import { GameState } from '../types';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../data/bank';
import { usePrestigeState } from './state/usePrestigeState';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useTutorialTriggers = (
    gameState: GameState,
    prestigeState: ReturnType<typeof usePrestigeState>,
    setGameState: SetGameStateFn,
    onCanAscendFirstTime: () => void,
    onBankUnlockedFirstTime: () => void
) => {
    useEffect(() => {
        // FIX: Replaced prestigeState.canAscend(gameState) with prestigeState.getComputed(gameState).canAscend to align with the refactored hook structure.
        const canAscendNow = prestigeState.getComputed(gameState).canAscend;
        if (canAscendNow && !gameState.hasSeenAscensionTutorial) {
            onCanAscendFirstTime();
            setGameState(prev => ({...prev, hasSeenAscensionTutorial: true}));
        }
    }, [prestigeState, gameState, onCanAscendFirstTime, setGameState]);

    useEffect(() => {
        if (gameState.energy >= BANK_UNLOCK_TOTAL_ENERGY && !gameState.hasSeenBankTutorial) {
            onBankUnlockedFirstTime();
            setGameState(prev => ({...prev, hasSeenBankTutorial: true}));
        }
    }, [gameState.energy, gameState.hasSeenBankTutorial, onBankUnlockedFirstTime, setGameState]);
};
