import { RootState } from '../../lib/store';

// Constantes d'équilibrage spécifiques aux Upgrades
const TIER_PRODUCTION_MULTIPLIER = 3;
const TIER_BOOSTER_MULTIPLIER = 2;
const COST_GROWTH_COEFFICIENT = 1.15;

// Calcul de la production de base (Upgrades de type PRODUCTION)
export const selectBaseProduction = (state: RootState): number => {
    return state.upgrades.available
        .filter(u => u.type === 'PRODUCTION')
        .reduce((total, u) => {
            const productionPerUnit = u.baseProduction * Math.pow(TIER_PRODUCTION_MULTIPLIER, u.tier);
            return total + (productionPerUnit * u.owned);
        }, 0);
};

// Calcul du bonus des boosters (Upgrades de type BOOSTER)
export const selectBoosterBonus = (state: RootState): number => {
    return state.upgrades.available
        .filter(u => u.type === 'BOOSTER')
        .reduce((total, u) => {
            const bonusPerUnit = u.baseProduction * Math.pow(TIER_BOOSTER_MULTIPLIER, u.tier);
            return total + (bonusPerUnit * u.owned);
        }, 0);
};

// Calcul du coût dynamique d'une amélioration
export const selectUpgradeCost = (baseCost: number, owned: number): number => {
    return Math.floor(baseCost * Math.pow(COST_GROWTH_COEFFICIENT, owned));
};

// Sélecteur de filtrage pour l'UI
export const selectFilteredUpgrades = (state: RootState) => {
    const { available } = state.upgrades;
    const { activeCategory } = state.ui;

    if (activeCategory === 'ALL') return available;
    return available.filter(u => u.type === activeCategory);
};