import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { BANK_CONSTRUCTION_COST } from '../data/bank';

// UI Components
import SectionHeader from './ui/SectionHeader';
import BankUnlockPrompt from './bank/BankUnlockPrompt';
import SavingsPanel from './bank/SavingsPanel';
import LoanPanel from './bank/LoanPanel';
import UpgradesPanel from './bank/UpgradesPanel';

const BankSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber, setShowBankInfoPopup } = useGameContext();
    const { isBankUnlocked, energy, savingsBalance, currentLoan, bankLevel } = gameState;
    const { bankBonuses } = computedState;
    const { onBuildBank, onDepositSavings, onWithdrawSavings, onTakeOutLoan, onUpgradeBank } = handlers;
    
    const [activeTab, setActiveTab] = useState<'compte' | 'améliorations'>('compte');

    const renderBankUI = () => (
        <>
            <div className="flex justify-center border-b border-[var(--border-color)] mb-4">
                {(['compte', 'améliorations'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 text-xs sm:text-sm md:text-base transition-all duration-300 relative ${activeTab === tab ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                    >
                        {tab === 'compte' ? '🏦 Compte' : '📈 Améliorations'}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                    </button>
                ))}
            </div>

            <div className="bg-black/20 p-2 rounded-lg text-center text-xs mb-3 flex flex-col sm:flex-row sm:justify-center items-center gap-1 sm:gap-4">
                <span>Niveau Banque: <strong className="text-cyan-400">{bankLevel}</strong></span>
                <span>Taux Épargne: <strong className="text-cyan-400">{(bankBonuses.savingsInterest * 100).toFixed(1)}%/sec</strong></span>
                <span>Intérêt Prêt: <strong className="text-cyan-400">{(bankBonuses.loanInterest * 100)}%</strong></span>
            </div>

            {activeTab === 'compte' && (
                <div className="flex-grow overflow-y-auto no-scrollbar pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SavingsPanel 
                            savingsBalance={savingsBalance}
                            energy={energy}
                            onDeposit={onDepositSavings}
                            onWithdraw={onWithdrawSavings}
                            formatNumber={memoizedFormatNumber}
                        />
                        <LoanPanel 
                            currentLoan={currentLoan}
                            bankBonuses={bankBonuses}
                            onTakeLoan={onTakeOutLoan}
                            setShowBankInfoPopup={setShowBankInfoPopup}
                            formatNumber={memoizedFormatNumber}
                        />
                    </div>
                </div>
            )}
            
            {activeTab === 'améliorations' && (
                <div className="flex-grow overflow-y-auto custom-scrollbar-bank pr-2">
                    <UpgradesPanel 
                        bankLevel={bankLevel}
                        energy={energy}
                        currentLoan={currentLoan}
                        onUpgradeBank={onUpgradeBank}
                        formatNumber={memoizedFormatNumber}
                    />
                </div>
            )}
        </>
    );

    return (
        <section id="bank" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[85vh] sm:h-[80vh] bg-black/20 rounded-lg p-2 sm:p-4 flex flex-col">
                <SectionHeader title="Banque Quantique" energy={energy} formatNumber={memoizedFormatNumber} />
                {isBankUnlocked 
                    ? renderBankUI() 
                    : <BankUnlockPrompt 
                        onBuildBank={onBuildBank} 
                        energy={energy} 
                        cost={BANK_CONSTRUCTION_COST} 
                        formatNumber={memoizedFormatNumber} 
                      />
                }
            </div>
        </section>
    );
};

export default BankSection;