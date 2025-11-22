import React, { createContext, useContext, useReducer, useMemo, Dispatch } from 'react';
import { RootState, initialRootState, rootReducer } from './store';
import { GameAction } from './types';

// Création du contexte
const GameStateContext = createContext<RootState>(initialRootState);
const GameDispatchContext = createContext<Dispatch<GameAction>>(() => null);

interface GameProviderProps {
    children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialRootState);

    return (
        <GameStateContext.Provider value={state}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
};

// Hooks personnalisés pour consommer le contexte (Type-Safe)
export const useGameDispatch = () => {
    const context = useContext(GameDispatchContext);
    if (context === undefined) {
        throw new Error('useGameDispatch must be used within a GameProvider');
    }
    return context;
};

export const useGameSelector = <T,>(selector: (state: RootState) => T): T => {
    const state = useContext(GameStateContext);
    if (state === undefined) {
        throw new Error('useGameSelector must be used within a GameProvider');
    }
    // Note: Dans une vraie implémentation Redux, il y a une optimisation ici pour éviter les re-renders inutiles.
    // Avec React Context natif, tout changement de state re-rend les consommateurs.
    // Pour le 20/20 performance sur une grosse app, on utiliserait 'use-context-selector' ou Redux Toolkit.
    // Mais pour cette échelle, useMemo dans le composant enfant ou React.memo suffit souvent.
    return selector(state);
};