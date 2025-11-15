import { MAX_UPGRADE_LEVEL } from '../constants';
import { INITIAL_UPGRADES } from '../data/upgrades';
import { GameState, Upgrade } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';


export const getInitialState = (): GameState => {
    const upgradesWithState = INITIAL_UPGRADES.map(u => ({
        ...u,
        owned: 0,
        tier: 0, // Initial tier
        currentCost: u.baseCost,
    }));

    return {
        energy: 0,
        upgrades: upgradesWithState,
        ascensionLevel: 0,
        ascensionPoints: 0,
        achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a})),
        purchasedAscensionUpgrades: ['start'],
        // FIX: Initialize purchasedCoreUpgrades in the initial state.
        purchasedCoreUpgrades: ['core_start'],
        totalClicks: 0,
        hasSeenAscensionTutorial: false,
        coreCharge: 0,
        isCoreDischarging: false,
        coreDischargeEndTimestamp: null,
        quantumShards: 0,
        hasSeenCoreTutorial: false,
        totalEnergyProduced: 0,
        isBankUnlocked: false,
        isBankDiscovered: false,
        savingsBalance: 0,
        currentLoan: null,
        bankLevel: 0,
        hasSeenBankTutorial: false,
        loanTier: 0,
        purchasedShopUpgrades: [],
        productionHistory: [],
        seenUpgrades: [],
        viewedCategories: [],
        isShopUnlocked: false,
        isCoreUnlocked: false,
        hasUnseenShopItems: false,
        
        // New Quantum Path system
        chosenQuantumPath: null,
        quantumPathLevel: 0,
        hasInteractedWithQuantumCore: false,
        
        // New stats
        timePlayedInSeconds: 0,

        // New message center
        messageLog: [],
    };
};

/**
 * Calcule le coût d'une amélioration en fonction de son coût de base et du nombre possédé.
 * La formule est: Coût = CoûtDeBase * 1.08 ^ NiveauxPossédés
 * Un multiplicateur de coût global (bonus/malus) peut aussi être appliqué.
 * Un coût spécial (costOverride) peut être fourni pour outrepasser le calcul standard,
 * utilisé pour la remise après l'achat d'un seuil.
 */
export const calculateCost = (baseCost: number, owned: number, costMultiplier: number = 1, costOverride?: number): number => {
  if (costOverride !== undefined) {
    return costOverride;
  }
  return Math.floor(baseCost * Math.pow(1.08, owned) * costMultiplier);
};

export const formatNumber = (num: number, scientificNotation: boolean): string => {
  if (scientificNotation && num >= 10000) {
    return num.toExponential(2);
  }
  return Math.floor(num).toLocaleString('fr-FR');
};

export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds <= 0 || !isFinite(totalSeconds)) {
        return '0s';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0) {
        result += `${minutes}m `;
    }
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        result += `${seconds}s`;
    }

    return result.trim();
};

export const formatLongDuration = (totalSeconds: number): string => {
    if (totalSeconds <= 0 || !isFinite(totalSeconds)) {
        return '0s';
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    let result = '';
    if (days > 0) result += `${days}j `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === '') result += `${seconds}s`;

    return result.trim();
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
                effectiveBaseCost = cost / Math.pow(1.08, currentOwned);
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
            effectiveBaseCost = cost / Math.pow(1.08, currentOwned);
        }

        currentOwned++;
        nextLevelCostOverride = undefined; // Discount is consumed after one use
    }

    return { numToBuy, totalCost };
};