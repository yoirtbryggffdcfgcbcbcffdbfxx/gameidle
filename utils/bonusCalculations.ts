// utils/bonusCalculations.ts
import { Achievement, GameState } from '../types';
import { ASCENSION_UPGRADES } from '../data/ascension';
import { CORE_DISCHARGE_DURATION } from '../constants';
import { QUANTUM_PATHS } from '../data/quantumPaths';

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
