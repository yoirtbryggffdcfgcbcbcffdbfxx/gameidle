
import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { BANK_CONSTRUCTION_COST } from '../data/bank';

// UI Components
import SectionHeader from './ui/SectionHeader';
import BankUnlockPrompt from './bank/BankUnlockPrompt';
import SavingsPanel from './bank/SavingsPanel';
import LoanPanel from './bank/LoanPanel';
import UpgradesPanel from './bank/UpgradesPanel';
import ArchiveIcon from './ui/ArchiveIcon';
import DollarSignIcon from './ui/DollarSignIcon';
import BarChartIcon from './ui/BarChartIcon';
import CategoryDial from './ui/CategoryDial';

const BankSection: React.FC = () => {
    const gameContext = useGameContext();
    const { gameState, computedState, handlers, memoizedFormatNumber, popups } = gameContext;
    const { isBankUnlocked, energy } = gameState;
    
    const [activeTab, setActiveTab] = useState<'savings' | 'loan' | 'upgrades'>('savings');

    const tabs: { id: 'savings' | 'loan' | 'upgrades', name: string, icon: React.ReactNode, color: string }[] = [
        { id: 'savings', name: 'Stase', icon: <ArchiveIcon className="w-5 h-5" />, color: '#86efac' },
        { id: 'loan', name: 'Flux', icon: <DollarSignIcon className="w-5 h-5" />, color: '#67e8f9' },
        { id: 'upgrades', name: 'Structure', icon: <BarChartIcon className="w-5 h-5" />, color: '#fde047' },
    ];

    const containerScrollClass = activeTab === 'upgrades' 
        ? 'flex-grow overflow-hidden flex flex-col' 
        : 'flex-grow overflow-y-auto custom-scrollbar-bank pr-2 -mr-2 min-h-0';

    return (
        <section id="bank" className="fullscreen-section reveal">
             {/* UNIFIED GLASS PANEL STYLE */}
            <div className="w-full max-w-4xl h-[85dvh] sm:h-[80vh] bg-[#0a0a12]/70 backdrop-blur-xl border border-white/10 rounded-xl p-2 sm:p-4 flex flex-col transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <SectionHeader title="Coffre Temporel" energy={energy} formatNumber={memoizedFormatNumber} />
                {isBankUnlocked 
                    ? (
                        <div className="flex-grow flex flex-col min-h-0">
                            <div className="flex justify-center my-2 relative z-10 flex-shrink-0">
                                <CategoryDial
                                    tabs={tabs}
                                    activeTabId={activeTab}
                                    onTabSelect={(id) => setActiveTab(id as any)}
                                    variant="bank"
                                />
                            </div>
                            
                            <div className={containerScrollClass}>
                                <div className={activeTab === 'upgrades' ? 'h-full' : 'pr-2 pb-4'}>
                                    {activeTab === 'savings' && (
                                        <SavingsPanel 
                                            savingsBalance={gameState.savingsBalance}
                                            energy={gameState.energy}
                                            currentLoan={gameState.currentLoan}
                                            onDeposit={handlers.onDepositSavings}
                                            onWithdraw={handlers.onWithdrawSavings}
                                            formatNumber={memoizedFormatNumber}
                                            bankBonuses={computedState.bankBonuses}
                                        />
                                    )}
                                    {activeTab === 'loan' && (
                                        <LoanPanel 
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
                                    )}
                                    {activeTab === 'upgrades' && (
                                        <UpgradesPanel 
                                            bankLevel={gameState.bankLevel}
                                            energy={gameState.energy}
                                            currentLoan={gameState.currentLoan}
                                            onUpgradeBank={handlers.onUpgradeBank}
                                            formatNumber={memoizedFormatNumber}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                    : <BankUnlockPrompt 
                        onBuildBank={handlers.onBuildBank} 
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
