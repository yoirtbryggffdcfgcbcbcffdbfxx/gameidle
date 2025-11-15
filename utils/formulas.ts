// utils/formulas.ts
import { Achievement, GameState } from '../types';
import { ASCENSION_UPGRADES } from '../data/ascension';
import { CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, MAX_UPGRADE_LEVEL } from '../constants';
import { QUANTUM_PATHS } from '../data/quantumPaths';

// --- Bonus Calculations ---

export const calculateAscensionBonuses = (purchasedUpgrades: string[]) => {
    const bonuses = { productionMultiplier: 1, clickMultiplier: 1, costReduction: 1, startingEnergy: 0 };
    purchasedUpgrades.forEach(id => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (upgrade) {
            switch(upgrade.effect.type) {
                case 'PRODUCTION_MULTIPLIER': bonuses.productionMultiplier += upgrade.effect.value; break;
                case 'CLICK_POWER_MULTIPLIER': bonuses.clickMultiplier += upgrade.effect.value; break;
                case 'COST_REDUCTION': bonuses.costReduction -= upgrade.effect.value; break;
                case 'STARTING_ENERGY': bonuses.startingEnergy += upgrade.effect.value; break;
            }
        }
    });
    return bonuses;
};

export const calculateAchievementBonuses = (achievements: Achievement[]) => {
    const bonuses = { production: 1, click: 1, coreCharge: 1, costReduction: 1 };
    achievements.filter(a => a.unlocked).forEach(ach => {
         switch (ach.bonus.type) {
            case 'PRODUCTION': bonuses.production += ach.bonus.value / 100; break;
            case 'CLICK': bonuses.click += ach.bonus.value / 100; break;
            case 'CORE_CHARGE': bonuses.coreCharge += ach.bonus.value / 100; break;
            case 'COST_REDUCTION': bonuses.costReduction *= (1 - ach.bonus.value / 100); break;
        }
    });
    return bonuses;
};

export const calculateCoreBonuses = (gameState: GameState) => {
    const coreBonuses = { chargeRate: 1, multiplier: 5, duration: CORE_DISCHARGE_DURATION };
    if (gameState.chosenQuantumPath) {
        const pathData = QUANTUM_PATHS[gameState.chosenQuantumPath];
        for (let i = 0; i < gameState.quantumPathLevel; i++) {
            const upgrade = pathData.upgrades[i];
            if (upgrade) {
                if (upgrade.effects.rate) coreBonuses.chargeRate += upgrade.effects.rate;
                if (upgrade.effects.multiplier) coreBonuses.multiplier += upgrade.effects.multiplier;
            }
        }
    }
    return coreBonuses;
};

// --- Production Calculation ---

export const calculateProduction = (
    gameState: GameState,
    ascensionBonuses: ReturnType<typeof calculateAscensionBonuses>,
    achievementBonuses: ReturnType<typeof calculateAchievementBonuses>,
    coreBonuses: ReturnType<typeof calculateCoreBonuses>
) => {
    const baseProduction = gameState.upgrades
        .filter(u => u.type === 'PRODUCTION')
        // FIX: Use `baseProduction` and tier multiplier to calculate production.
        .reduce((sum, u) => {
            const productionPerUnit = u.baseProduction * Math.pow(2, u.tier);
            return sum + productionPerUnit * u.owned;
        }, 0);
        
    const boosterBonus = gameState.upgrades
        .filter(u => u.type === 'BOOSTER')
        // FIX: Use `baseProduction` and tier multiplier to calculate production.
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