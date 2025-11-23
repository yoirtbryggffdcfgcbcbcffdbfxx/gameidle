import { RootState } from '../../lib/store';

// ═════════════════════════════════════════════════════════════════════════════
// Constantes d'équilibrage spécifiques aux Upgrades
// ═════════════════════════════════════════════════════════════════════════════

/** Multiplicateur de production appliqué à chaque tier (x3 par tier) */
const TIER_PRODUCTION_MULTIPLIER = 3;

/** Multiplicateur de booster appliqué à chaque tier (x2 par tier) */
const TIER_BOOSTER_MULTIPLIER = 2;

/** Coefficient de croissance exponentielle du coût (1.15 = +15% par achat) */
const COST_GROWTH_COEFFICIENT = 1.15;

// ═════════════════════════════════════════════════════════════════════════════
// Selectors de Production
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calcule la production de base totale (énergie/seconde).
 * 
 * Agrège tous les upgrades de type PRODUCTION en appliquant :
 * - Le scaling par tier : `baseProduction * (3 ^ tier)`
 * - Le nombre d'unités possédées
 * 
 * @param state - État global de l'application
 * @returns Production totale en énergie/seconde
 * 
 * @example
 * ```ts
 * // Avec Gen1 (baseProduction: 1, tier: 0, owned: 5)
 * // Production = 1 * (3^0) * 5 = 5 énergie/sec
 * 
 * // Avec Gen1 (baseProduction: 1, tier: 1, owned: 5)
 * // Production = 1 * (3^1) * 5 = 15 énergie/sec
 * ```
 */
export const selectBaseProduction = (state: RootState): number => {
    return state.upgrades.available
        .filter(u => u.type === 'PRODUCTION')
        .reduce((total, u) => {
            const productionPerUnit = u.baseProduction * Math.pow(TIER_PRODUCTION_MULTIPLIER, u.tier);
            return total + (productionPerUnit * u.owned);
        }, 0);
};

/**
 * Calcule le bonus total des boosters (pourcentage).
 * 
 * Agrège tous les upgrades de type BOOSTER en appliquant :
 * - Le scaling par tier : `baseProduction * (2 ^ tier)`
 * - Le nombre d'unités possédées
 * 
 * @param state - État global de l'application
 * @returns Bonus total en pourcentage (ex: 50 = +50%)
 * 
 * @example
 * ```ts
 * // Avec Booster1 (baseProduction: 10, tier: 0, owned: 2)
 * // Bonus = 10 * (2^0) * 2 = 20%
 * 
 * // Avec Booster1 (baseProduction: 10, tier: 1, owned: 2)
 * // Bonus = 10 * (2^1) * 2 = 40%
 * ```
 * 
 * @remarks
 * Ce bonus est ensuite appliqué à la production totale dans `selectEffectiveProduction`.
 */
export const selectBoosterBonus = (state: RootState): number => {
    return state.upgrades.available
        .filter(u => u.type === 'BOOSTER')
        .reduce((total, u) => {
            const bonusPerUnit = u.baseProduction * Math.pow(TIER_BOOSTER_MULTIPLIER, u.tier);
            return total + (bonusPerUnit * u.owned);
        }, 0);
};

// ═════════════════════════════════════════════════════════════════════════════
// Selectors de Coût
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calcule le coût dynamique d'un upgrade avec scaling exponentiel.
 * 
 * Formule standard : `baseCost * (1.15 ^ owned)`
 * 
 * Si un discount de tier est actif (`costOverride`), il est prioritaire.
 * 
 * @param baseCost - Coût de base de l'upgrade
 * @param owned - Nombre d'unités déjà possédées
 * @param costOverride - Coût personnalisé (discount de tier, optionnel)
 * @returns Coût total pour le prochain achat
 * 
 * @example
 * ```ts
 * // Sans discount
 * selectUpgradeCost(100, 0) // 100 (premier achat)
 * selectUpgradeCost(100, 5) // 201 (100 * 1.15^5)
 * 
 * // Avec discount de tier
 * selectUpgradeCost(100, 5, 150) // 150 (discount appliqué)
 * ```
 */
export const selectUpgradeCost = (baseCost: number, owned: number, costOverride?: number): number => {
    if (costOverride !== undefined) {
        return costOverride; // Utiliser le discount si disponible
    }
    return Math.floor(baseCost * Math.pow(COST_GROWTH_COEFFICIENT, owned));
};

/**
 * Calcule le coût d'un achat de tier complet.
 * 
 * Un tier upgrade coûte 10x le coût d'un achat standard.
 * Utilisé pour les paliers (10, 25, 100 unités).
 * 
 * @param baseCost - Coût de base de l'upgrade
 * @param owned - Nombre d'unités déjà possédées
 * @param costOverride - Coût personnalisé (discount de tier, optionnel)
 * @returns Coût total pour acheter le tier
 * 
 * @example
 * ```ts
 * // Si le coût standard est 200
 * selectTierUpgradeCost(100, 5) // 2010 (201 * 10)
 * ```
 */
export const selectTierUpgradeCost = (baseCost: number, owned: number, costOverride?: number): number => {
    const normalCost = selectUpgradeCost(baseCost, owned, costOverride);
    return normalCost * 10;
};

// ═════════════════════════════════════════════════════════════════════════════
// Selectors de Gameplay
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Calcule la puissance totale d'un clic manuel.
 * 
 * Formule : `1 (base) + somme(upgrades CLICK avec scaling tier)`
 * 
 * @param state - État global de l'application
 * @returns Énergie gagnée par clic
 * 
 * @example
 * ```ts
 * // Sans upgrade CLICK
 * selectClickPower(state) // 1
 * 
 * // Avec Click1 (baseProduction: 5, tier: 0, owned: 3)
 * // Power = 1 + (5 * 3^0 * 3) = 16
 * ```
 */
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

// ═════════════════════════════════════════════════════════════════════════════
// Selectors d'UI et Filtrage
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Filtre les upgrades visibles dans l'interface selon :
 * 1. Le système d'unlock (énergie totale, parent requis)
 * 2. La catégorie active dans l'UI (ALL, PRODUCTION, CLICK, BOOSTER)
 * 
 * @param state - État global de l'application
 * @returns Liste des upgrades à afficher
 * 
 * @remarks
 * Règles d'unlock :
 * - Un upgrade est visible si `totalGenerated >= unlockCost`
 * - Si `requiredUpgradeId` est défini, le parent doit être possédé (owned > 0)
 * - Un upgrade déjà possédé reste toujours visible
 * 
 * @example
 * ```ts
 * // Gen1 : unlockCost = 0, requiredUpgradeId = undefined
 * // → Visible dès le début
 * 
 * // Gen2 : unlockCost = 1000, requiredUpgradeId = 'gen1'
 * // → Visible si totalGenerated >= 1000 ET gen1.owned > 0
 * ```
 */
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