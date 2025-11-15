import React, { useState, useMemo } from 'react';
import { GameState } from '../../types';
import { LOAN_REPAYMENT_RATE } from '../../data/bank';

interface LoanPanelProps {
    currentLoan: GameState['currentLoan'];
    energy: number;
    maxEnergy: number;
    bankBonuses: { loanInterest: number };
    onTakeLoan: (amount: number) => void;
    onRepayLoan: (amount: number) => void;
    setShowBankInfoPopup: (show: boolean) => void;
    formatNumber: (num: number) => string;
    loanTier: number;
}

const MobileLoanCard: React.FC<LoanPanelProps> = ({ currentLoan, energy, maxEnergy, bankBonuses, onTakeLoan, onRepayLoan, setShowBankInfoPopup, formatNumber, loanTier }) => {
    const [amount, setAmount] = useState('');

    const LOAN_OPTIONS = useMemo(() => {
        const multiplier = Math.pow(1000, loanTier);
        return [
            { label: "Petit Prêt", value: 50000 * multiplier },
            { label: "Prêt Moyen", value: 250000 * multiplier },
            { label: "Gros Prêt", value: 1000000 * multiplier },
        ];
    }, [loanTier]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
    };

    const handleRepay = () => {
        let numericAmount = parseInt(amount, 10);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        numericAmount = Math.min(numericAmount, energy, currentLoan!.remaining);
        if (numericAmount > 0) onRepayLoan(numericAmount);
        
        setAmount('');
    };
    
    if (currentLoan) {
        const repaymentTotal = currentLoan.amount * (1 + bankBonuses.loanInterest);
        const progress = 100 - (currentLoan.remaining / repaymentTotal) * 100;
        return (
            <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col border border-red-500/30 shadow-lg">
                 <h3 className="text-lg text-red-300 mb-1 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> Prêt Actif
                </h3>
                <p className="text-3xl text-red-400 font-bold">{formatNumber(currentLoan.remaining)}</p>
                <p className="text-xs text-red-400/80">restant à payer</p>

                <div className="w-full bg-black/50 rounded-full h-2.5 my-2">
                    <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                </div>
                <p className="text-[10px] opacity-70 mb-3">Total: {formatNumber(repaymentTotal)} | Remboursement auto: {LOAN_REPAYMENT_RATE * 100}% de la prod.</p>
                
                 <div className="mt-auto space-y-3">
                    <input 
                        type="text" 
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="Montant à rembourser" 
                        className="w-full bg-black/50 p-2 rounded-md border border-[var(--border-color)] text-white text-right placeholder:text-gray-500 focus:border-red-400 focus:ring-red-400 focus:ring-1 outline-none"
                    />
                    <button onClick={handleRepay} className="w-full p-2 rounded-md bg-red-700/80 hover:bg-red-600 transition-colors font-bold">Rembourser</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col border border-cyan-500/30 shadow-lg">
            <h3 className="text-lg text-cyan-300 mb-1 flex items-center gap-2">
                <span className="text-2xl">💰</span> Contracter un Prêt
                 <button 
                    onClick={() => setShowBankInfoPopup(true)} 
                    className="text-xs text-cyan-400 cursor-help p-1 px-2 rounded-full bg-cyan-900/50 ml-auto"
                    aria-label="Informations sur les prêts"
                >
                    ?
                </button>
            </h3>
            <p className="text-xs opacity-70 mb-3">Limite: {formatNumber(maxEnergy * 0.1)} ⚡ | Taux: {(bankBonuses.loanInterest * 100)}%</p>

            <div className="space-y-2 mt-auto">
                {LOAN_OPTIONS.map(opt => (
                     <button key={opt.label} onClick={() => onTakeLoan(opt.value)} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded-lg text-left">
                         <span className="font-bold text-sm">{opt.label}</span>
                         <span className="block text-xs text-cyan-300">{formatNumber(opt.value)} ⚡</span>
                     </button>
                ))}
            </div>
        </div>
    );
};

export default MobileLoanCard;
