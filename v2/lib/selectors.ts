import { RootState } from './store';
import { CORE_CONFIG } from '../features/core/model';
import { selectBaseProduction, selectBoosterBonus, selectUpgradeCost, selectTierUpgradeCost } from '../features/upgrades/selectors';

// ═════════════════════════════════════════════════════════════════════════════
// Re-exports pour faciliter les imports
// ═════════════════════════════════════════════════════════════════════════════

/** Utilitaire de formatage de nombres (ex: 1000 → '1.00K') */
export { formatNumber } from './formatters';

/** Selectors de coût d'upgrades (réexportés depuis upgrades/selectors) */
export { selectUpgradeCost, selectTierUpgradeCost };

// ═════════════════════════════════════════════════════════════════════════════
// Selectors d'orchestration globale (Cross-Feature)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calcule le multiplicateur global de production.
 * 
 * Combine les multiplicateurs de plusieurs features :
 * - Boosters d'upgrades (feature upgrades)
 * - Core quantique activé (feature core)
 * 
 * @param state - État global de l'application
 * @returns Multiplicateur total (ex: 2.5 = x2.5 production)
 * 
 * @example
 * ```ts
 * // Avec 20% de booster et core inactif
 * selectGlobalMultiplier(state) // 1.2
 * 
 * // Avec 20% de booster et core actif (x5)
 * selectGlobalMultiplier(state) // 6.0 (1.2 * 5)
 * ```
 * 
 * @remarks
 * Ce selector est utilisé par `selectEffectiveProduction` pour calculer
 * la production réelle du joueur.
 */
export const selectGlobalMultiplier = (state: RootState): number => {
    let multiplier = 1;

    // 1. Application des Boosters (Feature Upgrades)
    const boosterBonusPercent = selectBoosterBonus(state);
    multiplier *= (1 + boosterBonusPercent / 100);

    // 2. Application du Cœur (Feature Core)
    if (state.core.status === 'ACTIVE') {
        multiplier *= CORE_CONFIG.MULTIPLIER_ACTIVE;
    }

    return multiplier;
};

/**
 * Calcule la production effective d'énergie par seconde.
 * 
 * Formule : `Production de base * Multiplicateur global`
 * 
 * @param state - État global de l'application
 * @returns Production effective en énergie/seconde
 * 
 * @example
 * ```ts
 * // Avec 100 énergie/sec de base et x2 multiplicateur
 * selectEffectiveProduction(state) // 200
 * ```
 * 
 * @remarks
 * Ce selector est utilisé par :
 * - Le hook `useGameLoop` pour calculer l'énergie à ajouter à chaque tick
 * - L'UI pour afficher la production actuelle
 */
export const selectEffectiveProduction = (state: RootState): number => {
    const base = selectBaseProduction(state);
    const mult = selectGlobalMultiplier(state);
    return base * mult;
};