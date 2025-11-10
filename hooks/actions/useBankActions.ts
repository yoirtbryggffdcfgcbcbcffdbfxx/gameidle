import { useCallback } from 'react';
import { GameState } from '../../types';
import { BANK_UPGRADES } from '../../constants';
import { LoanResult, WithdrawResult, UpgradeBankResult } from '../useGameState';

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
        if (gameState.energy >= cost && !gameState.isBankUnlocked) {
            setGameState(prev => ({
                ...prev,
                energy: prev.energy - cost,
                isBankUnlocked: true,
            }));
            unlockAchievement("Capitaliste Quantique");
            return true;
        }
        return false;
    }, [gameState.energy, gameState.isBankUnlocked, setGameState, unlockAchievement]);

    const depositSavings = useCallback((amount: number) => {
        const actualAmount = Math.min(amount, gameState.energy);
        if (actualAmount > 0) {
            setGameState(prev => ({
                ...prev,
                energy: prev.energy - actualAmount,
                savingsBalance: prev.savingsBalance + actualAmount,
            }));
            return true;
        }
        return false;
    }, [gameState.energy, setGameState]);

    const withdrawSavings = useCallback((amount: number): WithdrawResult => {
        const actualWithdrawAmount = Math.min(amount, gameState.savingsBalance);
        if (actualWithdrawAmount <= 0) return { success: false, reason: 'zero_amount' };

        let repaidAmount = 0;
        let toEnergyAmount = actualWithdrawAmount;

        if (gameState.currentLoan) {
            const repayment = Math.min(actualWithdrawAmount, gameState.currentLoan.remaining);
            repaidAmount = repayment;
            toEnergyAmount -= repayment;
        }

        setGameState(prev => {
            let newLoan = prev.currentLoan;
            let loanFullyRepaid = false;
            
            if (newLoan) {
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

            return {
                ...prev,
                energy: prev.energy + toEnergyAmount,
                savingsBalance: prev.savingsBalance - actualWithdrawAmount,
                currentLoan: newLoan,
            };
        });
        
        return { success: true, withdrawnAmount: actualWithdrawAmount, repaidAmount, toEnergyAmount };
    }, [gameState.savingsBalance, gameState.currentLoan, setGameState, onLoanRepaid]);
    
    const takeOutLoan = useCallback((loanAmount: number): LoanResult => {
        if (gameState.currentLoan) {
            return { success: false, reason: "loan_exists" };
        }

        if (isNaN(loanAmount) || loanAmount <= 0) {
            return { success: false, reason: "invalid_amount" };
        }

        const maxLoan = maxEnergy * 0.10;
        if (loanAmount > maxLoan) {
            return { success: false, reason: "exceeds_max" };
        }

        const repaymentTotal = loanAmount * (1 + bankBonuses.loanInterest);
        const requiredCollateral = repaymentTotal * 0.10;

        if (gameState.energy < requiredCollateral) {
            return { success: false, reason: "insufficient_collateral" };
        }
        
        setGameState(prev => ({
            ...prev,
            energy: prev.energy + loanAmount,
            currentLoan: { amount: loanAmount, remaining: repaymentTotal },
        }));
        return { success: true };
    }, [gameState.currentLoan, gameState.energy, maxEnergy, bankBonuses.loanInterest, setGameState]);

    const upgradeBank = useCallback((): UpgradeBankResult => {
        const currentLevel = gameState.bankLevel;
        if (currentLevel >= BANK_UPGRADES.length - 1) {
            return { success: false, reason: 'max_level' };
        }
        
        const nextUpgrade = BANK_UPGRADES[currentLevel + 1];
        if (gameState.energy < nextUpgrade.cost) {
            return { success: false, reason: 'insufficient_energy' };
        }
        
        if (gameState.currentLoan) {
            return { success: false, reason: 'loan_active' };
        }

        setGameState(prev => ({
            ...prev,
            energy: prev.energy - nextUpgrade.cost,
            bankLevel: prev.bankLevel + 1,
        }));
        checkAchievement("Magnat de la Finance", true);
        return { success: true, newLevel: currentLevel + 1 };
    }, [gameState.bankLevel, gameState.energy, gameState.currentLoan, setGameState, checkAchievement]);

    return { buildBank, depositSavings, withdrawSavings, takeOutLoan, upgradeBank };
};
