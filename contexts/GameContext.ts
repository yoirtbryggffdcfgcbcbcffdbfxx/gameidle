
import { useContext } from 'react';
import { GameDataContext, GameDataValues } from './GameDataContext';
import { GameActionContext, GameActionValues } from './GameActionContext';

// Type combiné pour la rétrocompatibilité avec le code existant
export type GameEngineContextType = GameDataValues & GameActionValues;

/**
 * Hook principal (Façade)
 * Combine les données et les actions pour les composants qui ont besoin des deux.
 * Pour l'optimisation, préférez utiliser useGameData() ou useGameActions() séparément.
 */
export const useGameContext = (): GameEngineContextType => {
  const data = useContext(GameDataContext);
  const actions = useContext(GameActionContext);

  if (!data || !actions) {
    throw new Error('useGameContext must be used within the combined GameProviders (Data + Actions)');
  }

  // On fusionne les deux objets pour recréer l'interface monolithique
  return {
      ...data,
      ...actions
  };
};

// Export des contextes et hooks individuels pour une utilisation optimisée dans le futur
export { GameDataContext, useGameData } from './GameDataContext';
export { GameActionContext, useGameActions } from './GameActionContext';
export type { GameDataValues } from './GameDataContext';
export type { GameActionValues } from './GameActionContext';
