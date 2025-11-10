import React, { createContext, useContext } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';

// Crée un type basé sur ce que le hook useGameEngine retourne.
// C'est une pratique robuste pour garder le type synchronisé.
type GameEngineContextType = ReturnType<typeof useGameEngine> | null;

// Crée le contexte avec une valeur par défaut de null.
export const GameContext = createContext<GameEngineContextType>(null);

// Crée un hook personnalisé pour consommer le contexte.
// C'est la manière recommandée d'accéder aux données du contexte.
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    // Cette erreur se déclenchera si un composant essaie d'utiliser le contexte
    // en dehors d'un GameContext.Provider, ce qui est une bonne pratique de sécurité.
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};
