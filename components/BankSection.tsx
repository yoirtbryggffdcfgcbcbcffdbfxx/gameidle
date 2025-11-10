import React, { useState, useEffect } from 'react';
import { BANK_CONSTRUCTION_COST, BANK_UPGRADES, LOAN_REPAYMENT_RATE, LOAN_OPTIONS } from '../constants';
import { useGameContext } from '../contexts/GameContext';

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);

const BankSection: React.FC = () => {
    const { gameState, computedState, handlers, memoizedFormatNumber, setShowBankInfoPopup } = useGameContext();
    // FIX: Get `bankBonuses` from computed state.
    const { isBankUnlocked, energy, savingsBalance, currentLoan, bankLevel } = gameState;
    const { bankBonuses } = computedState;
    const { onBuildBank, onDepositSavings, onWithdrawSavings, onTakeOutLoan, onUpgradeBank } = handlers;
    
    const [activeTab, setActiveTab] = useState<'compte' | 'améliorations'>('compte');
    const [savingsAmount, setSavingsAmount] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFirstVisit(false);
        }, 3000); // Animation is 1.5s and runs twice.
        return () => clearTimeout(timer);
    }, []);

    const handleSavingsAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setSavingsAmount(value);
    };

    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setLoanAmount(value);
    };
    
    const handleTransaction = (action: 'deposit' | 'withdraw', percentage?: number) => {
        let amount = 0;
        const sourceAmount = action === 'deposit' ? energy : savingsBalance;
        if (percentage) {
            amount = Math.floor(sourceAmount * percentage);
        } else {
            amount = parseInt(savingsAmount, 10);
        }
        if (isNaN(amount) || amount <= 0) return;

        if (action === 'deposit') onDepositSavings(amount);
        // FIX: `onWithdrawSavings` expects only one argument.
        else onWithdrawSavings(amount);
        
        setSavingsAmount('');
    };

    const handleTakeLoan = (amount: number) => {
        if (isNaN(amount) || amount <= 0) return;
        onTakeOutLoan(amount);
        setLoanAmount('');
    };
    
    const nextUpgrade = bankLevel < BANK_UPGRADES.length - 1 ? BANK_UPGRADES[bankLevel + 1] : null;

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

            {/* Account Tab */}
            <div className={`flex-grow overflow-y-auto no-scrollbar pr-2 ${activeTab !== 'compte' && 'hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Savings Panel */}
                    <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg flex flex-col">
                        <h3 className="text-base sm:text-lg text-yellow-400 mb-2">🐷 Compte Épargne</h3>
                        <p className="text-xs mb-2">Solde:</p>
                        <p className="text-xl sm:text-2xl text-green-400 font-bold mb-4">{memoizedFormatNumber(savingsBalance)} ⚡</p>
                        <div className="mt-auto space-y-4">
                             <input type="text" value={savingsAmount} onChange={handleSavingsAmountChange} placeholder="Montant personnalisé" className="w-full bg-black/50 p-2 rounded border border-[var(--border-color)] text-white text-right"/>
                            
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-400 font-semibold flex-shrink-0">DÉPOSER</span>
                                    <div className="w-full h-px bg-green-400/20"></div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    <button onClick={() => handleTransaction('deposit', 0.25)} className="p-2 bg-black/20 hover:bg-black/40 rounded">25%</button>
                                    <button onClick={() => handleTransaction('deposit', 0.50)} className="p-2 bg-black/20 hover:bg-black/40 rounded">50%</button>
                                    <button onClick={() => handleTransaction('deposit', 1)} className="p-2 bg-black/20 hover:bg-black/40 rounded">MAX</button>
                                    <button onClick={() => handleTransaction('deposit')} className="p-2 rounded bg-green-700 hover:bg-green-600 col-span-1">Montant</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-yellow-400 font-semibold flex-shrink-0">RETIRER</span>
                                    <div className="w-full h-px bg-yellow-400/20"></div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    <button onClick={() => handleTransaction('withdraw', 0.25)} className="p-2 bg-black/20 hover:bg-black/40 rounded">25%</button>
                                    <button onClick={() => handleTransaction('withdraw', 0.50)} className="p-2 bg-black/20 hover:bg-black/40 rounded">50%</button>
                                    <button onClick={() => handleTransaction('withdraw', 1)} className="p-2 bg-black/20 hover:bg-black/40 rounded">MAX</button>
                                    <div className="relative group col-span-1">
                                         <button onClick={() => handleTransaction('withdraw')} className="w-full h-full p-2 rounded bg-yellow-700 hover:bg-yellow-600">Montant</button>
                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-60 mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            Le retrait de l'épargne remboursera automatiquement tout prêt en cours en priorité.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Panel */}
                    <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg flex flex-col">
                        {currentLoan ? (
                            <>
                                <h3 className="text-base sm:text-lg text-red-400 mb-2">⚠️ Prêt Actif</h3>
                                <div className="text-xs space-y-2 flex-grow flex flex-col">
                                    <p>Restant à payer: <strong className="text-red-400 text-lg sm:text-xl">{memoizedFormatNumber(currentLoan.remaining)}</strong></p>
                                    <div className="w-full bg-black/50 rounded-full h-2.5 my-1">
                                        <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${100 - (currentLoan.remaining / (currentLoan.amount * (1 + bankBonuses.loanInterest))) * 100}%`}}></div>
                                    </div>
                                    <p className="opacity-70">Total à rembourser: {memoizedFormatNumber(currentLoan.amount * (1 + bankBonuses.loanInterest))}</p>
                                    <p className="mt-auto pt-4 opacity-80"><strong className="text-cyan-400">{LOAN_REPAYMENT_RATE * 100}%</strong> de votre production est utilisé pour le remboursement.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base sm:text-lg text-cyan-400 mb-2 flex items-center">
                                    💰 Contracter un Prêt
                                    <button
                                        onClick={() => {
                                            setShowBankInfoPopup(true);
                                            setIsFirstVisit(false);
                                        }}
                                        className={`relative group inline-block ml-2 rounded-full transition-all duration-300 ${isFirstVisit ? 'animate-attention-pulse-once' : ''}`}
                                        aria-label="Afficher les astuces"
                                    >
                                        <span className="text-xs text-cyan-400 cursor-help block p-1">(i)</span>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Astuces
                                        </div>
                                    </button>
                                </h3>
                                <div className="text-xs space-y-2 flex flex-col h-full">
                                    <p className="opacity-70 mb-2">Remboursement automatique.</p>
                                    <div className="space-y-2">
                                        {LOAN_OPTIONS.map(o => (<button key={o} onClick={() => handleTakeLoan(o)} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded">Emprunter {memoizedFormatNumber(o)}</button>))}
                                    </div>
                                    <div className="mt-auto space-y-2 pt-2">
                                        <input type="text" value={loanAmount} onChange={handleLoanAmountChange} placeholder="Montant personnalisé" className="w-full bg-black/50 p-2 rounded border border-[var(--border-color)] text-white text-right" />
                                        <button onClick={() => handleTakeLoan(parseInt(loanAmount, 10))} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded">Emprunter Montant Perso</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

             {/* Upgrade Tab */}
            <div className={`flex-grow overflow-y-auto custom-scrollbar-bank pr-2 ${activeTab !== 'améliorations' && 'hidden'}`}>
                 <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg">
                    <h3 className="text-base sm:text-lg text-yellow-400 mb-4 text-center">Progression de la Banque</h3>
                    <div className="relative w-full max-w-md mx-auto">
                        {/* Timeline */}
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-600"></div>
                        <ul className="space-y-8">
                            {BANK_UPGRADES.map((upgrade, index) => {
                                const isUnlocked = bankLevel >= index;
                                const isNext = bankLevel + 1 === index;
                                return (
                                    <li key={index} className="flex items-center">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${isUnlocked ? 'bg-green-600 border-green-400' : 'bg-gray-700 border-gray-500'}`}>
                                            {isUnlocked ? '✓' : index}
                                        </div>
                                        <div className={`ml-2 sm:ml-4 transition-opacity duration-300 ${!isUnlocked && !isNext ? 'opacity-50' : ''}`}>
                                            <p className={`font-bold ${isUnlocked ? 'text-green-400' : (isNext ? 'text-yellow-400' : 'text-gray-400')}`}>Niveau {index}</p>
                                            <p className="text-xs">{upgrade.description}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    
                    <div className="mt-8 border-t border-white/10 pt-4">
                        {nextUpgrade ? (
                            <div className="text-center">
                                <p className="text-sm">Prochaine Amélioration :</p>
                                <p className="text-base sm:text-lg text-cyan-300 my-2">{nextUpgrade.description}</p>
                                <button onClick={onUpgradeBank} disabled={energy < nextUpgrade.cost || !!currentLoan} className="px-3 py-2 sm:px-4 rounded bg-cyan-700 hover:enabled:bg-cyan-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                    Coût: {memoizedFormatNumber(nextUpgrade.cost)} ⚡
                                </button>
                                {!!currentLoan && (
                                    <p className="text-red-400 text-center text-xs mt-2 flex items-center justify-center gap-2">
                                        <span className="text-lg">🔒</span> Vous ne pouvez pas améliorer la banque avec un prêt en cours.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-green-400 text-center">🏆 Banque au niveau maximum !</p>
                        )}
                    </div>
                 </div>
            </div>
        </>
    );
    
    const renderUnlockUI = () => (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-2">
            <div className="text-5xl sm:text-6xl mb-4">🏦</div>
            <h3 className="text-lg sm:text-xl text-yellow-400">Système Bancaire Détecté</h3>
            <p className="my-4 max-w-sm text-sm sm:text-base">Les protocoles pour une gestion financière avancée sont disponibles. Construisez la Banque pour débloquer l'épargne et les prêts.</p>
            <button
                onClick={onBuildBank}
                disabled={energy < BANK_CONSTRUCTION_COST}
                className="p-3 rounded-md bg-green-700 text-white transition-all disabled:bg-gray-600 disabled:cursor-not-allowed hover:enabled:bg-green-600 text-base sm:text-lg"
            >
                Construire la Banque ({memoizedFormatNumber(BANK_CONSTRUCTION_COST)} ⚡)
            </button>
        </div>
    );

    return (
        <section id="bank" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[85vh] sm:h-[80vh] bg-black/20 rounded-lg p-2 sm:p-4 flex flex-col">
                <SectionHeader title="Banque Quantique" energy={energy} formatNumber={memoizedFormatNumber} />
                {isBankUnlocked ? renderBankUI() : renderUnlockUI()}
            </div>
        </section>
    );
};

export default BankSection;
