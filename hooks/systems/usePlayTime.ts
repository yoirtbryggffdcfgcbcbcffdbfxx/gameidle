
import { useEffect, Dispatch, SetStateAction } from 'react';
import { GameState } from '../../types';

interface PlayTimeDeps {
    appState: string;
    setGameState: Dispatch<SetStateAction<GameState>>;
}

export const usePlayTime = ({ appState, setGameState }: PlayTimeDeps) => {
    useEffect(() => {
        const timer = setInterval(() => {
            if (appState === 'game') {
                setGameState(prev => ({ ...prev, timePlayedInSeconds: prev.timePlayedInSeconds + 1 }));
            }
        }, 1000); // Increment every second

        return () => clearInterval(timer);
    }, [appState, setGameState]);
};
