
// utils/gameplayCalculations.ts
import { GameState, Upgrade } from '../types';
import { calculateAscensionBonuses, calculateAchievementBonuses, calculateCoreBonuses } from './bonusCalculations';
import { TIER_PRODUCTION_MULTIPLIER, TIER_BOOSTER_MULTIPLIER } from '../constants';

// --- Production Calculation ---

export const calculateProduction = (
    gameState: GameState,
    ascensionBonuses: ReturnType<typeof calculateAscensionBonuses>,
    achievementBonuses: ReturnType<typeof calculateAchievementBonuses>,
    coreBonuses: ReturnType<typeof calculateCoreBonuses>
) => {
    const baseProduction = gameState.upgrades
        .filter(u => u.type === 'PRODUCTION')
        .reduce((sum, u) => {
            // REBALANCE: Use TIER_PRODUCTION_MULTIPLIER (x3) instead of hardcoded 2
            const productionPerUnit = u.baseProduction * Math.pow(TIER_PRODUCTION_MULTIPLIER, u.tier);
            return sum + productionPerUnit * u.owned;
        }, 0);
        
    const boosterBonus = gameState.upgrades
        .filter(u => u.type === 'BOOSTER')
        .reduce((sum, u) => {
            // REBALANCE V5: Boosters now use exponential scaling (Base * Multiplier^Tier)
            // This makes Tier upgrades for boosters massively more powerful (x2 multiplicative)
            // instead of additive.
            const tierMultiplier = Math.pow(TIER_BOOSTER_MULTIPLIER, u.tier);
            const productionPerUnit = u.baseProduction * tierMultiplier;
            return sum + productionPerUnit * u.owned;
        }, 0);

    let productionMultiplier = ascensionBonuses.productionMultiplier * achievementBonuses.production * (1 + boosterBonus / 100);
    
    if (gameState.isCoreDischarging) {
        productionMultiplier *= coreBonuses.multiplier;
    }

    const productionTotal = baseProduction * productionMultiplier;
    
    return { baseProduction, productionTotal };
};


// --- Ascension Logic ---

export const calculateCanAscend = (
    ascensionLevel: number,
    energy: number,
    maxEnergy: number,
    unlockedUpgradesAtMaxLevelCount: number,
    unlockedUpgradesForCurrentAscensionCount: number
) => {
    let canAscend = false;
    const energyMet = energy >= maxEnergy;
    if (ascensionLevel === 0) {
        canAscend = energyMet && unlockedUpgradesAtMaxLevelCount === unlockedUpgradesForCurrentAscensionCount && unlockedUpgradesForCurrentAscensionCount > 0;
    } else {
        canAscend = energyMet;
    }
    
    const ascensionGain = canAscend ? Math.floor(ascensionLevel / 2) + 1 : 1;
    
    return { canAscend, ascensionGain };
};

// --- Core Charge Logic ---

export const calculateTimeToFullCharge = (
    coreCharge: number,
    finalChargeRatePerSecond: number
) => {
    const remainingCharge = 100 - coreCharge;
    return remainingCharge > 0 && finalChargeRatePerSecond > 0
        ? remainingCharge / finalChargeRatePerSecond
        : 0;
};

// --- Upgrade Visibility Logic (Forge) ---

export const determineVisibleUpgrades = (
    upgrades: Upgrade[],
    totalEnergyProduced: number,
    ascensionLevel: number,
    seenUpgrades: string[]
) => {
    const visibleUpgrades = upgrades
        .map((upgradeData, originalIndex) => ({ upgradeData, originalIndex }))
        .filter(({ upgradeData }) => {
            // CONDITION 1 : Énergie Totale ou Déjà Possédé (Critère de base)
            // La Règle des 75% est définie dans unlockCost dans data/upgrades.ts
            const basicUnlockMet = upgradeData.unlockCost <= totalEnergyProduced || upgradeData.owned > 0;
            
            if (!basicUnlockMet) return false;

            // CONDITION 2 : Dépendance Technologique (Critère parent)
            if (upgradeData.requiredUpgradeId) {
                const parentUpgrade = upgrades.find(u => u.id === upgradeData.requiredUpgradeId);
                // Si le parent existe mais n'est pas possédé (niveau 0), on masque l'enfant
                // même si le joueur a assez d'énergie.
                if (parentUpgrade && parentUpgrade.owned === 0) {
                    return false;
                }
            }

            // CONDITION 3 : Niveau d'Ascension
            return upgradeData.requiredAscension <= ascensionLevel;
        });

    const newlyVisibleUpgradeIds = visibleUpgrades
        .map(u => u.upgradeData.id)
        .filter(id => !seenUpgrades.includes(id));

    const newlyVisibleUpgradeTypes = new Set<string>();
    if (newlyVisibleUpgradeIds.length > 0) {
        const newUpgrades = visibleUpgrades.filter(u => newlyVisibleUpgradeIds.includes(u.upgradeData.id));
        newUpgrades.forEach(u => newlyVisibleUpgradeTypes.add(u.upgradeData.type));
    }

    return {
        visibleUpgrades,
        newlyVisibleUpgradeIds,
        newlyVisibleUpgradeTypes
    };
};
