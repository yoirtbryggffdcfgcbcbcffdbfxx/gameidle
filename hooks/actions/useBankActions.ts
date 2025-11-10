import { useCallback } from 'react';
import { GameState } from '../../types';
import { BANK_UPGRADES } from '../../constants';
// FIX: Corrected import path for type definitions. They are exported from `useBankState.ts`.
import type { LoanResult, WithdrawResult, UpgradeBankResult } from '../state/useBankState';

export const useBankActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gameState: GameState,
    maxEnergy: number,
    bankBonuses: { loanInterest: number },
    onLoanRepaid: () => void,
    unlockAchievement: (name: string) => void,
    checkAchievement: (name: string, condition: boolean) => void
) => {
    const buildBank = useCallback((cost: number) => {
        let success = false;
        setGameState(prev => {
            if (prev.energy >= cost && !prev.isBankUnlocked) {
                success = true;
                unlockAchievement("Capitaliste Quantique");
                return {
                    ...prev,
                    energy: prev.energy - cost,
                    isBankUnlocked: true,
                };
            }
            return prev;
        });
        return success;
    }, [setGameState, unlockAchievement]);

    const depositSavings = useCallback((amount: number) => {
        let success = false;
        setGameState(prev => {
            const actualAmount = Math.min(amount, prev.energy);
            if (actualAmount > 0) {
                success = true;
                return {
                    ...prev,
                    energy: prev.energy - actualAmount,
                    savingsBalance: prev.savingsBalance + actualAmount,
                };
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
            let loanFullyRepaid = false;
            
            if (newLoan) {
                const repayment = Math.min(actualWithdrawAmount, newLoan.remaining);
                repaidAmount = repayment;
                toEnergyAmount -= repayment;
                
                const remaining = newLoan.remaining - repaidAmount;
                if (remaining <= 0) {
                    newLoan = null;
                    loanFullyRepaid = true;
                } else {
                    newLoan = { ...newLoan, remaining };
                }
            }
            
            if (loanFullyRepaid) {
                onLoanRepaid();
            }

            result = { success: true, withdrawnAmount: actualWithdrawAmount, repaidAmount, toEnergyAmount };

            return {
                ...prev,
                energy: prev.energy + toEnergyAmount,
                savingsBalance: prev.savingsBalance - actualWithdrawAmount,
                currentLoan: newLoan,
            };
        });
        
        return result;
    }, [setGameState, onLoanRepaid]);
    
    const takeOutLoan = useCallback((loanAmount: number): LoanResult => {
        let result: LoanResult = { success: false };

        setGameState(prev => {
            if (prev.currentLoan) {
                result = { success: false, reason: "loan_exists" };
                return prev;
            }
            if (isNaN(loanAmount) || loanAmount <= 0) {
                result = { success: false, reason: "invalid_amount" };
                return prev;
            }
            const maxLoan = maxEnergy * 0.10;
            if (loanAmount > maxLoan) {
                result = { success: false, reason: "exceeds_max" };
                return prev;
            }
            const repaymentTotal = loanAmount * (1 + bankBonuses.loanInterest);
            const requiredCollateral = repaymentTotal * 0.10;

            if (prev.energy < requiredCollateral) {
                result = { success: false, reason: "insufficient_collateral" };
                return prev;
            }
            
            result = { success: true };
            return {
                ...prev,
                energy: prev.energy + loanAmount,
                currentLoan: { amount: loanAmount, remaining: repaymentTotal },
            };
        });
        return result;
    }, [maxEnergy, bankBonuses.loanInterest, setGameState]);

    const upgradeBank = useCallback((): UpgradeBankResult => {
        let result: UpgradeBankResult = { success: false };

        setGameState(prev => {
            const currentLevel = prev.bankLevel;
            if (currentLevel >= BANK_UPGRADES.length - 1) {
                result = { success: false, reason: 'max_level' };
                return prev;
            }
            
            const nextUpgrade = BANK_UPGRADES[currentLevel + 1];
            if (prev.energy < nextUpgrade.cost) {
                result = { success: false, reason: 'insufficient_energy' };
                return prev;
            }
            
            if (prev.currentLoan) {
                result = { success: false, reason: 'loan_active' };
                return prev;
            }

            checkAchievement("Magnat de la Finance", true);
            result = { success: true, newLevel: currentLevel + 1 };

            return {
                ...prev,
                energy: prev.energy - nextUpgrade.cost,
                bankLevel: prev.bankLevel + 1,
            };
        });
        return result;
    }, [setGameState, checkAchievement]);

    return { buildBank, depositSavings, withdrawSavings, takeOutLoan, upgradeBank };
};