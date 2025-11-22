import { RootState } from './store';
import { CORE_CONFIG } from '../features/core/model';
import { selectBaseProduction, selectBoosterBonus, selectUpgradeCost, selectTierUpgradeCost } from '../features/upgrades/selectors';

// Re-export des utilitaires et sélecteurs spécifiques pour faciliter les imports
export { formatNumber } from './formatters';
export { selectUpgradeCost, selectTierUpgradeCost };

// --- SÉLECTEURS D'ORCHESTRATION GLOBALE ---
// Ces sélecteurs combinent des données provenant de plusieurs features (Cross-Domain)

// Multiplicateur global (Combine Core + Boosters d'Upgrades)
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

// Production effective (Base * Multiplicateur Global)
export const selectEffectiveProduction = (state: RootState): number => {
    const base = selectBaseProduction(state);
    const mult = selectGlobalMultiplier(state);
    return base * mult;
};