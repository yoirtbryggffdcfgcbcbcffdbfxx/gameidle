import React, { useState, useEffect } from 'react';
import { GameState } from '../../types';
import { LOAN_OPTIONS, LOAN_REPAYMENT_RATE } from '../../data/bank';

interface LoanPanelProps {
    currentLoan: GameState['currentLoan'];
    bankBonuses: { loanInterest: number; savingsInterest: number };
    onTakeLoan: (amount: number) => void;
    setShowBankInfoPopup: (show: boolean) => void;
    formatNumber: (num: number) => string;
}

const LoanPanel: React.FC<LoanPanelProps> = ({ currentLoan, bankBonuses, onTakeLoan, setShowBankInfoPopup, formatNumber }) => {
    const [loanAmount, setLoanAmount] = useState('');
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFirstVisit(false);
        }, 3000); // Animation is 1.5s and runs twice.
        return () => clearTimeout(timer);
    }, []);

    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setLoanAmount(value);
    };

    const handleTakeLoan = (amount: number) => {
        if (isNaN(amount) || amount <= 0) return;
        onTakeLoan(amount);
        setLoanAmount('');
    };

    return (
        <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg flex flex-col">
            {currentLoan ? (
                <>
                    <h3 className="text-base sm:text-lg text-red-400 mb-2">⚠️ Prêt Actif</h3>
                    <div className="text-xs space-y-2 flex-grow flex flex-col">
                        <p>Restant à payer: <strong className="text-red-400 text-lg sm:text-xl">{formatNumber(currentLoan.remaining)}</strong></p>
                        <div className="w-full bg-black/50 rounded-full h-2.5 my-1">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${100 - (currentLoan.remaining / (currentLoan.amount * (1 + bankBonuses.loanInterest))) * 100}%`}}></div>
                        </div>
                        <p className="opacity-70">Total à rembourser: {formatNumber(currentLoan.amount * (1 + bankBonuses.loanInterest))}</p>
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
                            {LOAN_OPTIONS.map(o => (<button key={o} onClick={() => handleTakeLoan(o)} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded">Emprunter {formatNumber(o)}</button>))}
                        </div>
                        <div className="mt-auto space-y-2 pt-2">
                            <input type="text" value={loanAmount} onChange={handleLoanAmountChange} placeholder="Montant personnalisé" className="w-full bg-black/50 p-2 rounded border border-[var(--border-color)] text-white text-right" />
                            <button onClick={() => handleTakeLoan(parseInt(loanAmount, 10))} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded">Emprunter Montant Perso</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoanPanel;
