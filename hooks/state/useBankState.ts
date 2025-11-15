// hooks/state/useBankState.ts
// FIX: Import React to provide namespace for types.
import React, { useCallback } from 'react';
import { GameState } from '../../types';
// FIX: Import missing constant to resolve reference error.
import { BANK_UPGRADES, LOAN_REPAYMENT_RATE } from '../../data/bank';
import { TICK_RATE } from '../../constants';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type UnlockAchievementFn = (name: string) => void;

export const useBankState = (
    setGameState: SetGameStateFn,
    unlockAchievement: UnlockAchievementFn,
) => {
    const getComputed = (gameState: GameState) => {
        const currentLevel = Math.min(gameState.bankLevel, BANK_UPGRADES.length - 1);
        const bankBonuses = BANK_UPGRADES[currentLevel];
        return { bankBonuses };
    };

    const buildBank = useCallback((cost: number): void => {
        setGameState(prev => {
            if (prev.energy >= cost && !prev.isBankUnlocked) {
                unlockAchievement(ACHIEVEMENT_IDS.QUANTUM_CAPITALIST);
                return { ...prev, energy: prev.energy - cost, isBankUnlocked: true };
            }
            return prev;
        });
    }, [setGameState, unlockAchievement]);

    const depositSavings = useCallback((amount: number): void => {
        setGameState(prev => {
            const actualAmount = Math.min(amount, prev.energy);
            if (actualAmount > 0) {
                return { ...prev, energy: prev.energy - actualAmount, savingsBalance: prev.savingsBalance + actualAmount };
            }
            return prev;
        });
    }, [setGameState]);

    const withdrawSavings = useCallback((amount: number): void => {
        setGameState(prev => {
            const actualWithdrawAmount = Math.min(amount, prev.savingsBalance);
            if (actualWithdrawAmount <= 0) return prev;
            
            let toEnergyAmount = actualWithdrawAmount;
            let newLoan = prev.currentLoan;
            
            if (newLoan) {
                const repayment = Math.min(actualWithdrawAmount, newLoan.remaining);
                toEnergyAmount -= repayment;
                const remaining = newLoan.remaining - repayment;
                if (remaining <= 0) {
                    newLoan = null;
                    // The onLoanRepaid callback is now called by the game loop
                } else {
                    newLoan = { ...newLoan, remaining };
                }
            }
            return { ...prev, energy: prev.energy + toEnergyAmount, savingsBalance: prev.savingsBalance - actualWithdrawAmount, currentLoan: newLoan };
        });
    }, [setGameState]);
    
    const takeOutLoan = useCallback((loanAmount: number): void => {
        setGameState(prev => {
            // All checks are now in the handler. This action assumes it's valid.
            const { bankBonuses } = getComputed(prev);
            const repaymentTotal = loanAmount * (1 + bankBonuses.loanInterest);
            return { ...prev, energy: prev.energy + loanAmount, currentLoan: { amount: loanAmount, remaining: repaymentTotal } };
        });
    }, [setGameState]);

    const upgradeBank = useCallback((): void => {
        setGameState(prev => {
            // All checks are now in the handler.
            const nextUpgrade = BANK_UPGRADES[prev.bankLevel + 1];
            unlockAchievement(ACHIEVEMENT_IDS.FINANCIAL_TYCOON);
            return { ...prev, energy: prev.energy - nextUpgrade.cost, bankLevel: prev.bankLevel + 1 };
        });
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

    const repayLoanManually = useCallback((amount: number): void => {
        setGameState(prev => {
            if (!prev.currentLoan) {
                return prev;
            }
            const actualRepayment = Math.min(amount, prev.energy, prev.currentLoan.remaining);
            if (actualRepayment <= 0) {
                return prev;
            }

            const remaining = prev.currentLoan.remaining - actualRepayment;
            let newLoan = prev.currentLoan;
            if (remaining <= 0) {
                newLoan = null;
            } else {
                newLoan = { ...prev.currentLoan, remaining };
            }

            return { ...prev, energy: prev.energy - actualRepayment, currentLoan: newLoan };
        });
    }, [setGameState]);

    return { 
        getComputed,
        actions: { buildBank, depositSavings, withdrawSavings, takeOutLoan, upgradeBank, repayLoanManually },
        handleLoanRepayment,
        calculateInterest,
    };
};
