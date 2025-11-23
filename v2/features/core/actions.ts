import { Action } from '../../lib/types';

/**
 * Union discriminée de toutes les actions liées au Core.
 * 
 * Gère l'activation manuelle et la charge automatique du cœur quantique.
 */
export type CoreAction =
    /** Activation manuelle du core (quand charge = 100%) */
    | { type: 'CORE_ACTIVATE' }
    /** Tick de charge/décharge automatique */
    | { type: 'CORE_TICK'; payload: { delta: number } };

/**
 * Créateur d'action pour activer le core manuellement.
 * 
 * Déclenche le boost de production x5 pendant 10 secondes.
 * Ne fonctionne que si le core est à 100% de charge (status = 'READY').
 * 
 * @returns Action CORE_ACTIVATE
 * 
 * @example
 * ```ts
 * const isReady = useGameSelector(state => state.core.status === 'READY');
 * if (isReady) {
 *   dispatch(activateCore());
 * }
 * ```
 */
export const activateCore = (): CoreAction => ({
    type: 'CORE_ACTIVATE'
});

/**
 * Créateur d'action pour le tick automatique du core.
 * 
 * Appelé par `useGameLoop` toutes les 100ms pour :
 * - Charger le core progressivement (si CHARGING)
 * - Décharger le core pendant l'activation (si ACTIVE)
 * 
 * @param delta - Temps écoulé en millisecondes (généralement 100ms)
 * @returns Action CORE_TICK
 * 
 * @example
 * ```ts
 * // Dans useGameLoop
 * useEffect(() => {
 *   const interval = setInterval(() => {
 *     dispatch(tickCore(100));
 *   }, 100);
 *   return () => clearInterval(interval);
 * }, [dispatch]);
 * ```
 */
export const tickCore = (delta: number): CoreAction => ({
    type: 'CORE_TICK',
    payload: { delta }
});
