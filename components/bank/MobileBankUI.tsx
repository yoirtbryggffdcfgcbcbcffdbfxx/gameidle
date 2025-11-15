import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import MobileSavingsCard from './mobile/MobileSavingsCard';
import MobileLoanCard from './mobile/MobileLoanCard';
import MobileUpgradesCard from './mobile/MobileUpgradesCard';

const MobileBankUI: React.FC<ReturnType<typeof useGameContext>> = (gameContext) => {
    const { gameState, computedState, handlers, memoizedFormatNumber, popups } = gameContext;

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-black/20 p-2 rounded-lg text-center text-[10px] grid grid-cols-3 gap-1">
                <span>Niveau: <strong className="text-cyan-400">{gameState.bankLevel}</strong></span>
                <span>Épargne: <strong className="text-cyan-400">{(computedState.bankBonuses.savingsInterest * 100).toFixed(1)}%</strong></span>
                <span>Prêt: <strong className="text-cyan-400">{(computedState.bankBonuses.loanInterest * 100)}%</strong></span>
            </div>

            <MobileSavingsCard 
                savingsBalance={gameState.savingsBalance}
                energy={gameState.energy}
                onDeposit={handlers.onDepositSavings}
                onWithdraw={handlers.onWithdrawSavings}
                formatNumber={memoizedFormatNumber}
            />

            <MobileLoanCard
                currentLoan={gameState.currentLoan}
                energy={gameState.energy}
                bankBonuses={computedState.bankBonuses}
                onTakeLoan={handlers.onTakeOutLoan}
                onRepayLoan={handlers.onRepayLoan}
                setShowBankInfoPopup={popups.setShowBankInfoPopup}
                formatNumber={memoizedFormatNumber}
                loanTier={gameState.loanTier}
                maxEnergy={computedState.maxEnergy}
            />
            
            <MobileUpgradesCard 
                bankLevel={gameState.bankLevel}
                energy={gameState.energy}
                currentLoan={gameState.currentLoan}
                onUpgradeBank={handlers.onUpgradeBank}
                formatNumber={memoizedFormatNumber}
            />
        </div>
    );
};

export default MobileBankUI;