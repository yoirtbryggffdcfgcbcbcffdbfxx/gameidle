import { RootState } from '../../lib/store';
import { CORE_CONFIG } from './model';

/**
 * Sélectionne le multiplicateur de production du core.
 * 
 * Retourne x5 si le core est actif, sinon x1.
 * 
 * @param state - État global de l'application
 * @returns Multiplicateur de production (1 ou 5)
 * 
 * @example
 * ```ts
 * const multiplier = selectCoreMultiplier(state);
 * // Si core actif : 5
 * // Sinon : 1
 * ```
 * 
 * @remarks
 * Ce selector est utilisé par `selectGlobalMultiplier` dans `lib/selectors.ts`
 * pour calculer la production effective.
 */
export const selectCoreMultiplier = (state: RootState): number => {
    return state.core.status === 'ACTIVE' ? CORE_CONFIG.MULTIPLIER_ACTIVE : 1;
};

/**
 * Vérifie si le core est prêt à être activé.
 * 
 * @param state - État global de l'application
 * @returns `true` si le core est à 100% de charge, `false` sinon
 * 
 * @example
 * ```ts
 * const isReady = selectIsReady(state);
 * if (isReady) {
 *   // Afficher notification "PRÊT !"
 *   // Permettre l'activation
 * }
 * ```
 */
export const selectIsReady = (state: RootState): boolean => {
    return state.core.status === 'READY';
};

/**
 * Calcule le temps restant d'activation en secondes.
 * 
 * @param state - État global de l'application
 * @returns Temps restant en secondes (arrondi au supérieur)
 * 
 * @example
 * ```ts
 * const countdown = selectCountdown(state);
 * // Si activeTimeRemaining = 5500ms → 6 secondes
 * ```
 */
export const selectCountdown = (state: RootState): number => {
    if (state.core.status !== 'ACTIVE') return 0;
    return Math.ceil(state.core.activeTimeRemaining / 1000);
};
