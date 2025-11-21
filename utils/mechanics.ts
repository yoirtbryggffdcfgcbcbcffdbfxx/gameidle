
import { MAX_UPGRADE_LEVEL } from '../constants';
import { Upgrade } from '../types';

/**
 * CONSTANTE DE CROISSANCE
 * 1.15 est le standard de l'industrie (Cookie Clicker, etc.)
 * Cela assure que le coût augmente de 15% à chaque achat, créant une courbe stratégique.
 * Avec 1.15, le coût double environ tous les 5 niveaux.
 */
const COST_GROWTH_COEFFICIENT = 1.15;

/**
 * Calcule le coût d'une amélioration en fonction de son coût de base et du nombre possédé.
 * La formule est: Coût = CoûtDeBase * 1.15 ^ NiveauxPossédés
 * Un multiplicateur de coût global (bonus/malus) peut aussi être appliqué.
 * Un coût spécial (costOverride) peut être fourni pour outrepasser le calcul standard,
 * utilisé pour la remise après l'achat d'un seuil.
 */
export const calculateCost = (baseCost: number, owned: number, costMultiplier: number = 1, costOverride?: number): number => {
  if (costOverride !== undefined) {
    return costOverride;
  }
  return Math.floor(baseCost * Math.pow(COST_GROWTH_COEFFICIENT, owned) * costMultiplier);
};

/**
 * Calculates the total cost and number of upgrades/tiers that can be bought in a single bulk operation,
 * intelligently handling tier thresholds and post-tier discounts.
 * The function iterates level by level, buying tiers when available, until energy runs out or the desired amount is purchased.
 */
export const calculateBulkBuy = (
    upgrade: Upgrade,
    amount: number | 'MAX',
    energy: number,
    costMultiplier: number
): { numLevelsBought: number; tiersBought: number; totalCost: number; newBaseCost?: number, nextLevelCostOverride?: number } => {
    let numLevelsBought = 0;
    let tiersBought = 0;
    let totalCost = 0;
    let tempEnergy = energy;

    let currentOwned = upgrade.owned;
    let currentTier = upgrade.tier;
    let effectiveBaseCost = upgrade.baseCost;
    let nextLevelCostOverride: number | undefined = upgrade.nextLevelCostOverride;
    let newBaseCostResult: number | undefined = undefined;

    const maxAmount = amount === 'MAX' ? MAX_UPGRADE_LEVEL : Math.min(amount, MAX_UPGRADE_LEVEL - currentOwned);
    let levelsToProcess = amount === 'MAX' ? MAX_UPGRADE_LEVEL - currentOwned : amount;

    while (levelsToProcess > 0 && currentOwned < MAX_UPGRADE_LEVEL) {
        // Step 1: Check if a tier upgrade is pending and affordable
        if (currentOwned > 0 && currentOwned % 10 === 0 && currentTier < currentOwned / 10) {
            const tierUpgradeCost = calculateCost(effectiveBaseCost, currentOwned, costMultiplier) * 10;
            if (tempEnergy >= tierUpgradeCost) {
                tempEnergy -= tierUpgradeCost;
                totalCost += tierUpgradeCost;
                tiersBought++;
                currentTier++;
                // Set up discount for the next level after this tier
                nextLevelCostOverride = Math.floor(tierUpgradeCost * 0.9);
            } else {
                break; // Can't afford tier upgrade, stop the whole process
            }
        }

        // Step 2: Try to buy the next normal level
        const cost = calculateCost(effectiveBaseCost, currentOwned, costMultiplier, nextLevelCostOverride);

        if (tempEnergy >= cost) {
            tempEnergy -= cost;
            totalCost += cost;
            numLevelsBought++;

            // If a discount was used, the base cost effectively changes for future calculations
            if (nextLevelCostOverride) {
                // We recalculate base cost so that future formula calls match the discounted reality
                effectiveBaseCost = cost / Math.pow(COST_GROWTH_COEFFICIENT, currentOwned);
                newBaseCostResult = effectiveBaseCost;
            }
            
            currentOwned++;
            levelsToProcess--;
            nextLevelCostOverride = undefined; // Discount is consumed after one use
        } else {
            break; // Can't afford the next level
        }
    }

    return { numLevelsBought, tiersBought, totalCost, newBaseCost: newBaseCostResult, nextLevelCostOverride };
};


/**
 * Calculates the total cost for a theoretical bulk buy for display purposes, ignoring energy.
 * This version now fully simulates the purchase, including tier costs and discounts,
 * to provide a 100% accurate cost estimate on the purchase button.
 */
export const calculateTheoreticalBulkBuy = (
    upgrade: Upgrade,
    amount: number,
    costMultiplier: number
): { numToBuy: number; totalCost: number } => {
    let totalCost = 0;
    let currentOwned = upgrade.owned;
    let currentTier = upgrade.tier;
    let effectiveBaseCost = upgrade.baseCost;
    let nextLevelCostOverride: number | undefined = upgrade.nextLevelCostOverride;

    const numToBuy = Math.min(amount, MAX_UPGRADE_LEVEL - currentOwned);
    
    if (numToBuy <= 0) {
        return { numToBuy: 0, totalCost: 0 };
    }

    for (let i = 0; i < numToBuy; i++) {
        // Step 1: Check if a tier upgrade would be required
        if (currentOwned > 0 && currentOwned % 10 === 0 && currentTier < currentOwned / 10) {
            const tierUpgradeCost = calculateCost(effectiveBaseCost, currentOwned, costMultiplier) * 10;
            totalCost += tierUpgradeCost;
            currentTier++;
            nextLevelCostOverride = Math.floor(tierUpgradeCost * 0.9);
        }

        // Step 2: Calculate cost of the actual level
        const cost = calculateCost(effectiveBaseCost, currentOwned, costMultiplier, nextLevelCostOverride);
        totalCost += cost;
        
        // If a discount was used, the base cost effectively changes for future calculations
        if (nextLevelCostOverride) {
            effectiveBaseCost = cost / Math.pow(COST_GROWTH_COEFFICIENT, currentOwned);
        }

        currentOwned++;
        nextLevelCostOverride = undefined; // Discount is consumed after one use
    }

    return { numToBuy, totalCost };
};

/**
 * Calcule le pourcentage de chance d'apparition d'un cadeau en fonction du niveau.
 * Refonte v2: Progression ralentie.
 */
export const calculateGiftChance = (level: number): number => {
    let chance = 0;
    // Base : 0.1% dès le niveau 1
    if (level >= 1) chance = 0.1;

    // Niveau 2 à 10 : +0.05% par niveau
    // Niv 10 = 0.1 + (9 * 0.05) = 0.55% (~180s)
    if (level > 1) chance += Math.min(level - 1, 9) * 0.05;

    // Niveau 11 à 50 : +0.1% par niveau
    // Niv 50 = 0.55 + (40 * 0.1) = 4.55% (~22s)
    if (level > 10) chance += Math.min(level - 10, 40) * 0.1;

    // Niveau 51+ : +0.2% par niveau
    // Niv 100 = 4.55 + (50 * 0.2) = 14.55% (~6.8s)
    if (level > 50) chance += (level - 50) * 0.2;

    return chance;
}
