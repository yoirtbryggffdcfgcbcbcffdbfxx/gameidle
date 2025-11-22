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

// Calcul de la puissance de clic (Upgrades de type CLICK)
export const selectClickPower = (state: RootState): number => {
    const baseClick = 1; // Valeur de base d'un clic
    const bonus = state.upgrades.available
        .filter(u => u.type === 'CLICK')
        .reduce((total, u) => {
            const powerPerUnit = u.baseProduction * Math.pow(TIER_PRODUCTION_MULTIPLIER, u.tier);
            return total + (powerPerUnit * u.owned);
        }, 0);
    return baseClick + bonus;
};

// Sélecteur de filtrage pour l'UI (Catégorie + Unlock System)
export const selectVisibleUpgrades = (state: RootState) => {
    const { available } = state.upgrades;
    const { activeCategory } = state.ui;
    const totalGenerated = state.resources.totalGenerated;

    // 1. Filtrer par Unlock Condition
    const unlocked = available.filter(u => {
        // Condition 1: Avoir assez d'énergie totale générée (Unlock Cost)
        const hasEnoughTotal = totalGenerated >= u.unlockCost;

        // Condition 2: Avoir l'upgrade parent (si requis)
        let hasParent = true;
        if (u.requiredUpgradeId) {
            const parent = available.find(p => p.id === u.requiredUpgradeId);
            hasParent = parent ? parent.owned > 0 : false;
        }

        // Condition 3: Être déjà possédé (toujours visible si possédé)
        const isOwned = u.owned > 0;

        return isOwned || (hasEnoughTotal && hasParent);
    });

    // 2. Filtrer par Catégorie UI
    if (activeCategory === 'ALL') return unlocked;
    return unlocked.filter(u => u.type === activeCategory);
};