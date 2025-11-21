
import { useMemo } from 'react';
import { Upgrade } from '../../types';
import { MAX_UPGRADE_LEVEL, TIER_PRODUCTION_MULTIPLIER, TIER_BOOSTER_MULTIPLIER } from '../../constants';
import { calculateBulkBuy, calculateTheoreticalBulkBuy, calculateCost } from '../../utils/helpers';

interface UseUpgradeCalculationsProps {
    upgrade: Upgrade;
    energy: number;
    costMultiplier: number;
    buyAmount: 1 | 10 | 100 | 'MAX';
    formatNumber: (num: number) => string;
}

export const useUpgradeCalculations = ({
    upgrade,
    energy,
    costMultiplier,
    buyAmount,
    formatNumber
}: UseUpgradeCalculationsProps) => {
    
    const isMaxLevel = upgrade.owned >= MAX_UPGRADE_LEVEL;
    // Tier threshold logic: level 10, 20, 30... but not yet upgraded tier
    const isAtTierThreshold = upgrade.owned > 0 && upgrade.owned % 10 === 0 && !isMaxLevel && upgrade.tier < upgrade.owned / 10;
    const isBoosterUpgrade = upgrade.type === 'BOOSTER';
    const isClickUpgrade = upgrade.type === 'CLICK';

    // --- Production & Stats ---
    const currentProductionPerUnit = useMemo(() => {
        if (isBoosterUpgrade) {
             // REBALANCE: Exponential scaling for boosters too
            return upgrade.baseProduction * Math.pow(TIER_BOOSTER_MULTIPLIER, upgrade.tier);
        }
        // REBALANCE: Use TIER_PRODUCTION_MULTIPLIER for Clicks too if we want consistency, 
        // currently Clicks use PRODUCTION multiplier in some places, need to ensure consistency.
        // For now, sticking to TIER_PRODUCTION_MULTIPLIER which is 3.
        return upgrade.baseProduction * Math.pow(TIER_PRODUCTION_MULTIPLIER, upgrade.tier);
    }, [upgrade.baseProduction, upgrade.tier, isBoosterUpgrade]);

    const productionLabel = isClickUpgrade ? '/clic' : isBoosterUpgrade ? '%' : '/sec';
    
    const productionValue = isBoosterUpgrade 
        ? `+${formatNumber(currentProductionPerUnit)}%` 
        : `+${formatNumber(currentProductionPerUnit)}`;

    const totalProductionValue = isBoosterUpgrade
        ? `+${formatNumber(currentProductionPerUnit * upgrade.owned)}%`
        : formatNumber(currentProductionPerUnit * upgrade.owned);

    // --- Costs & Purchasing ---
    const tierUpgradeCost = useMemo(() => {
        return calculateCost(upgrade.baseCost, upgrade.owned, costMultiplier) * 10;
    }, [upgrade.baseCost, upgrade.owned, costMultiplier]);

    const purchaseInfo = useMemo(() => {
        if (isAtTierThreshold) return { numLevelsBought: 0, totalCost: 0 };
        return calculateBulkBuy(upgrade, buyAmount, energy, costMultiplier);
    }, [upgrade, buyAmount, energy, costMultiplier, isAtTierThreshold]);

    const theoreticalPurchaseInfo = useMemo(() => {
        if (isAtTierThreshold || typeof buyAmount !== 'number') return null;
        return calculateTheoreticalBulkBuy(upgrade, buyAmount, costMultiplier);
    }, [upgrade, buyAmount, costMultiplier, isAtTierThreshold]);

    const canAfford = useMemo(() => {
        if (isMaxLevel) return false;
        if (isAtTierThreshold) return energy >= tierUpgradeCost;
        return purchaseInfo.numLevelsBought > 0;
    }, [isMaxLevel, isAtTierThreshold, energy, tierUpgradeCost, purchaseInfo.numLevelsBought]);

    const purchaseCount = purchaseInfo.numLevelsBought > 0 ? purchaseInfo.numLevelsBought : (theoreticalPurchaseInfo?.numToBuy || 1);
    const purchaseCost = purchaseInfo.numLevelsBought > 0 ? purchaseInfo.totalCost : (theoreticalPurchaseInfo?.totalCost || upgrade.currentCost);

    // --- Projected Gain Calculation ---
    const projectedGainLabel = useMemo(() => {
        if (isMaxLevel) return null;

        let gain = 0;

        if (isAtTierThreshold) {
            // Gain from Tier Upgrade
            if (isBoosterUpgrade) {
                // Multiplicative gain: CurrentTotal * (Multiplier - 1)
                // e.g. Multiplier is 2. Gain is Total * 1.
                const currentTotal = currentProductionPerUnit * upgrade.owned;
                gain = currentTotal * (TIER_BOOSTER_MULTIPLIER - 1);
            } else {
                // Multiplicative gain: CurrentTotal * (Multiplier - 1)
                const currentTotal = currentProductionPerUnit * upgrade.owned;
                gain = currentTotal * (TIER_PRODUCTION_MULTIPLIER - 1);
            }
        } else {
            // Gain from buying units (Standard)
            // Note: currentProductionPerUnit is constant until next tier
            gain = currentProductionPerUnit * purchaseCount;
        }

        if (gain === 0) return null;

        return `+${formatNumber(gain)}${productionLabel}`;

    }, [isMaxLevel, isAtTierThreshold, isBoosterUpgrade, upgrade.baseProduction, upgrade.owned, currentProductionPerUnit, purchaseCount, formatNumber, productionLabel]);

    return {
        isMaxLevel,
        isAtTierThreshold,
        isBoosterUpgrade,
        productionLabel,
        productionValue,
        totalProductionValue,
        tierUpgradeCost,
        purchaseCount,
        purchaseCost,
        canAfford,
        projectedGainLabel
    };
};