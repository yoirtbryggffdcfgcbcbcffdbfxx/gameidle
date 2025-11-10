import { useEffect } from 'react';
import { GameState } from '../types';
import { TICK_RATE } from '../constants';
import { LOAN_REPAYMENT_RATE } from '../data/bank';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useGameLoop = (
    appState: string,
    loadStatus: string,
    setGameState: SetGameStateFn,
    prestigeState: ReturnType<typeof usePrestigeState>,
    bankState: ReturnType<typeof useBankState>,
    onLoanRepaid: () => void
) => {
    useEffect(() => {
        if (appState !== 'game' || loadStatus === 'loading') return;

        const gameTick = setInterval(() => {
            setGameState(prev => {
                const productionThisTick = prestigeState.productionTotal(prev) / (1000 / TICK_RATE);
                let energyFromProduction = productionThisTick;
                
                const { newLoan, wasLoanRepaid } = bankState.handleLoanRepayment(prev.currentLoan, productionThisTick);
                if (wasLoanRepaid) onLoanRepaid();
                energyFromProduction -= (productionThisTick * (newLoan ? LOAN_REPAYMENT_RATE : 0));
                
                const newTotalEnergyProduced = prev.totalEnergyProduced + productionThisTick;
                const newEnergy = Math.min(prev.energy + energyFromProduction, prestigeState.maxEnergy(prev));
                const newSavingsBalance = bankState.calculateInterest(prev);
                const newCoreCharge = prestigeState.calculateCoreCharge(prev);

                return { 
                    ...prev, 
                    energy: newEnergy, 
                    coreCharge: newCoreCharge, 
                    totalEnergyProduced: newTotalEnergyProduced, 
                    savingsBalance: newSavingsBalance, 
                    currentLoan: newLoan 
                };
            });
        }, TICK_RATE);
        return () => clearInterval(gameTick);
    }, [appState, loadStatus, setGameState, prestigeState, bankState, onLoanRepaid]);
};
