import { useCallback } from 'react';
import { GameState } from '../../types';
// FIX: Import missing constant to resolve reference error.
import { BANK_UPGRADES, LOAN_REPAYMENT_RATE } from '../../data/bank';
import { TICK_RATE } from '../../constants';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type UnlockAchievementFn = (name: string) => void;

// FIX: Export interfaces so they can be imported by other modules.
export interface LoanResult {
    success: boolean;
    reason?: 'loan_exists' | 'exceeds_max' | 'insufficient_collateral' | 'invalid_amount';
}

export interface WithdrawResult {
    success: boolean;
    reason?: 'zero_amount';
    withdrawnAmount?: number;
    repaidAmount?: number;
    toEnergyAmount?: number;
}

export interface UpgradeBankResult {
    success: boolean;
    reason?: 'max_level' | 'insufficient_energy' | 'loan_active';
    newLevel?: number;
}

export const useBankState = (
    setGameState: SetGameStateFn,
    unlockAchievement: UnlockAchievementFn,
) => {
    const getComputed = (gameState: GameState) => {
        const currentLevel = Math.min(gameState.bankLevel, BANK_UPGRADES.length - 1);
        const bankBonuses = BANK_UPGRADES[currentLevel];
        return { bankBonuses };
    };

    const buildBank = useCallback((cost: number): boolean => {
        let success = false;
        setGameState(prev => {
            if (prev.energy >= cost && !prev.isBankUnlocked) {
                success = true;
                unlockAchievement("Capitaliste Quantique");
                return { ...prev, energy: prev.energy - cost, isBankUnlocked: true };
            }
            return prev;
        });
        return success;
    }, [setGameState, unlockAchievement]);

    const depositSavings = useCallback((amount: number): boolean => {
        let success = false;
        setGameState(prev => {
            const actualAmount = Math.min(amount, prev.energy);
            if (actualAmount > 0) {
                success = true;
                return { ...prev, energy: prev.energy - actualAmount, savingsBalance: prev.savingsBalance + actualAmount };
            }
            return prev;
        });
        return success;
    }, [setGameState]);

    const withdrawSavings = useCallback((amount: number): WithdrawResult => {
        let result: WithdrawResult = { success: false, reason: 'zero_amount' };
        setGameState(prev => {
            const actualWithdrawAmount = Math.min(amount, prev.savingsBalance);
            if (actualWithdrawAmount <= 0) return prev;
            let repaidAmount = 0;
            let toEnergyAmount = actualWithdrawAmount;
            let newLoan = prev.currentLoan;
            
            if (newLoan) {
                const repayment = Math.min(actualWithdrawAmount, newLoan.remaining);
                repaidAmount = repayment;
                toEnergyAmount -= repayment;
                const remaining = newLoan.remaining - repayment;
                if (remaining <= 0) {
                    newLoan = null;
                    // The onLoanRepaid callback is now called by the game loop
                } else {
                    newLoan = { ...newLoan, remaining };
                }
            }
            result = { success: true, withdrawnAmount: actualWithdrawAmount, repaidAmount, toEnergyAmount };
            return { ...prev, energy: prev.energy + toEnergyAmount, savingsBalance: prev.savingsBalance - actualWithdrawAmount, currentLoan: newLoan };
        });
        return result;
    }, [setGameState]);
    
    const takeOutLoan = useCallback((loanAmount: number): LoanResult => {
        let result: LoanResult = { success: false };
        setGameState(prev => {
            if (prev.currentLoan) { result = { success: false, reason: "loan_exists" }; return prev; }
            if (isNaN(loanAmount) || loanAmount <= 0) { result = { success: false, reason: "invalid_amount" }; return prev; }
            const maxEnergy = 1e9 * Math.pow(10, prev.ascensionLevel);
            const maxLoan = maxEnergy * 0.10;
            if (loanAmount > maxLoan) { result = { success: false, reason: "exceeds_max" }; return prev; }
            const { bankBonuses } = getComputed(prev);
            const repaymentTotal = loanAmount * (1 + bankBonuses.loanInterest);
            const requiredCollateral = repaymentTotal * 0.10;
            if (prev.energy < requiredCollateral) { result = { success: false, reason: "insufficient_collateral" }; return prev; }
            
            result = { success: true };
            return { ...prev, energy: prev.energy + loanAmount, currentLoan: { amount: loanAmount, remaining: repaymentTotal } };
        });
        return result;
    }, [setGameState]);

    const upgradeBank = useCallback((): UpgradeBankResult => {
        let result: UpgradeBankResult = { success: false };
        setGameState(prev => {
            if (prev.bankLevel >= BANK_UPGRADES.length - 1) { result = { success: false, reason: 'max_level' }; return prev; }
            const nextUpgrade = BANK_UPGRADES[prev.bankLevel + 1];
            if (prev.energy < nextUpgrade.cost) { result = { success: false, reason: 'insufficient_energy' }; return prev; }
            if (prev.currentLoan) { result = { success: false, reason: 'loan_active' }; return prev; }
            unlockAchievement("Magnat de la Finance");
            result = { success: true, newLevel: prev.bankLevel + 1 };
            return { ...prev, energy: prev.energy - nextUpgrade.cost, bankLevel: prev.bankLevel + 1 };
        });
        return result;
    }, [setGameState, unlockAchievement]);

    const handleLoanRepayment = (currentLoan: GameState['currentLoan'], productionThisTick: number) => {
        let newLoan = currentLoan;
        let wasLoanRepaid = false;
        if (newLoan && newLoan.remaining > 0 && productionThisTick > 0) {
            const repaymentAmount = productionThisTick * LOAN_REPAYMENT_RATE;
            const actualRepayment = Math.min(repaymentAmount, newLoan.remaining);
            const remaining = newLoan.remaining - actualRepayment;
            if (remaining <= 0) {
                newLoan = null;
                wasLoanRepaid = true;
            } else {
                newLoan = { ...newLoan, remaining };
            }
        }
        return { newLoan, wasLoanRepaid };
    };
    
    const calculateInterest = (gameState: GameState): number => {
        const { bankBonuses } = getComputed(gameState);
        const interestThisTick = gameState.savingsBalance * bankBonuses.savingsInterest / (1000 / TICK_RATE);
        return gameState.savingsBalance + interestThisTick;
    };

    return { 
        getComputed,
        actions: { buildBank, depositSavings, withdrawSavings, takeOutLoan, upgradeBank },
        handleLoanRepayment,
        calculateInterest,
    };
};