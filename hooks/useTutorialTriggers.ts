import { useEffect } from 'react';
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
        const canAscendNow = prestigeState.canAscend(gameState);
        if (canAscendNow && !gameState.hasSeenAscensionTutorial) {
            onCanAscendFirstTime();
            setGameState(prev => ({...prev, hasSeenAscensionTutorial: true}));
        }
    }, [prestigeState, gameState, onCanAscendFirstTime, setGameState]);

    useEffect(() => {
        if (gameState.totalEnergyProduced >= BANK_UNLOCK_TOTAL_ENERGY && !gameState.hasSeenBankTutorial) {
            onBankUnlockedFirstTime();
            setGameState(prev => ({...prev, hasSeenBankTutorial: true}));
        }
    }, [gameState.totalEnergyProduced, gameState.hasSeenBankTutorial, onBankUnlockedFirstTime, setGameState]);
};
