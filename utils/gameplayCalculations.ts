// utils/gameplayCalculations.ts
import { GameState } from '../types';
import { calculateAscensionBonuses, calculateAchievementBonuses, calculateCoreBonuses } from './bonusCalculations';

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
            const productionPerUnit = u.baseProduction * Math.pow(2, u.tier);
            return sum + productionPerUnit * u.owned;
        }, 0);
        
    const boosterBonus = gameState.upgrades
        .filter(u => u.type === 'BOOSTER')
        .reduce((sum, u) => {
            const productionPerUnit = u.baseProduction * Math.pow(2, u.tier);
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