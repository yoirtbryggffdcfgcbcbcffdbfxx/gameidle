
import { GameState } from '../../types';
import { calculateAscensionBonuses, calculateAchievementBonuses, calculateCoreBonuses } from '../bonusCalculations';
import { calculateProduction } from '../gameplayCalculations';
import { CORE_CHARGE_RATE } from '../../constants';
import { LOAN_REPAYMENT_RATE } from '../../data/bank';

interface EconomySystemDeps {
    gameState: GameState;
    deltaTime: number; // ms
    prestigeStateComputed: { maxEnergy: number };
    bankState: {
        handleLoanRepayment: (currentLoan: any, production: number) => { newLoan: any, wasLoanRepaid: boolean };
        getComputed: (state: GameState) => { bankBonuses: { savingsInterest: number } };
    };
}

export const processEconomySystem = (
    currentState: GameState,
    coreSystemResult: { isCoreDischarging: boolean },
    deps: EconomySystemDeps
) => {
    const { deltaTime, bankState } = deps;
    
    // Calculate Production with updated core state
    const tempStateForCalc = { ...currentState, isCoreDischarging: coreSystemResult.isCoreDischarging };
    
    const ascensionBonuses = calculateAscensionBonuses(tempStateForCalc.purchasedAscensionUpgrades);
    const achievementBonuses = calculateAchievementBonuses(tempStateForCalc.achievements);
    const coreBonuses = calculateCoreBonuses(tempStateForCalc);
    
    const production = calculateProduction(tempStateForCalc, ascensionBonuses, achievementBonuses, coreBonuses);
    const productionThisFrame = production.productionTotal * (deltaTime / 1000);
    
    let energyFromProduction = productionThisFrame;

    // Bank Logic
    const { newLoan, wasLoanRepaid } = bankState.handleLoanRepayment(currentState.currentLoan, productionThisFrame);
    if (newLoan) {
        energyFromProduction -= (productionThisFrame * LOAN_REPAYMENT_RATE);
    }
    const { bankBonuses } = bankState.getComputed(currentState);
    const newSavingsBalance = currentState.savingsBalance + (currentState.savingsBalance * bankBonuses.savingsInterest * (deltaTime / 1000));

    // Core Charging Logic
    const chargeRatePerSecond = CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge;
    let newCoreCharge = currentState.coreCharge;
    if (currentState.isCoreUnlocked && !coreSystemResult.isCoreDischarging && newCoreCharge < 100) {
        newCoreCharge = Math.min(100, newCoreCharge + (chargeRatePerSecond * (deltaTime / 1000)));
    }
    
    return {
        productionThisFrame,
        energyFromProduction,
        newLoan,
        wasLoanRepaid,
        newSavingsBalance,
        newCoreCharge,
        productionTotal: production.productionTotal // Returned for UI/History
    };
};
