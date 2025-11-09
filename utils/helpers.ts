import { MAX_UPGRADE_LEVEL } from '../constants';
import { Upgrade } from '../types';

export const calculateCost = (baseCost: number, owned: number, costMultiplier: number = 1): number => {
  // Exposant de coût ajusté de 1.10 à 1.08 pour un meilleur équilibrage en fin de partie
  return Math.floor(baseCost * Math.pow(1.08, owned) * costMultiplier);
};

export const formatNumber = (num: number, scientificNotation: boolean): string => {
  if (scientificNotation && num >= 10000) {
    return num.toExponential(2);
  }
  return Math.floor(num).toLocaleString('fr-FR');
};

/**
 * Calculates the total cost and number of upgrades that can be bought in bulk.
 */
export const calculateBulkBuy = (
    upgrade: Upgrade,
    amount: number | 'MAX',
    energy: number,
    costMultiplier: number
): { numToBuy: number; totalCost: number } => {
    let numToBuy = 0;
    let totalCost = 0;
    let currentOwned = upgrade.owned;
    let tempEnergy = energy;

    const maxLevelsToBuy = amount === 'MAX' 
      ? MAX_UPGRADE_LEVEL - currentOwned
      : Math.min(amount, MAX_UPGRADE_LEVEL - currentOwned);

    if (maxLevelsToBuy <= 0) {
      return { numToBuy: 0, totalCost: 0 };
    }
    
    for (let i = 0; i < maxLevelsToBuy; i++) {
        const cost = calculateCost(upgrade.baseCost, currentOwned, costMultiplier);
        if (tempEnergy >= cost) {
            tempEnergy -= cost;
            totalCost += cost;
            numToBuy++;
            currentOwned++;
        } else {
            break; // Can't afford the next one
        }
    }

    return { numToBuy, totalCost };
};

/**
 * Calculates the total cost and number of upgrades for a theoretical bulk buy, ignoring the user's energy.
 */
export const calculateTheoreticalBulkBuy = (
    upgrade: Upgrade,
    amount: number,
    costMultiplier: number
): { numToBuy: number; totalCost: number } => {
    let totalCost = 0;
    let currentOwned = upgrade.owned;
    
    const maxLevelsToBuy = Math.min(amount, MAX_UPGRADE_LEVEL - currentOwned);
    if (maxLevelsToBuy <= 0) {
        return { numToBuy: 0, totalCost: 0 };
    }

    for (let i = 0; i < maxLevelsToBuy; i++) {
        const cost = calculateCost(upgrade.baseCost, currentOwned, costMultiplier);
        totalCost += cost;
        currentOwned++;
    }

    return { numToBuy: maxLevelsToBuy, totalCost };
};
