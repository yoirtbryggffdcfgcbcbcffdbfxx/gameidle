
import React, { useState, useMemo } from 'react';
import { GameState } from '../../../types';
import { LOAN_REPAYMENT_RATE } from '../../../data/bank';
import ChevronDownIcon from '../../ui/ChevronDownIcon';

interface MobileLoanCardProps {
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

const PercentageChip: React.FC<{ label: string; onClick: () => void; color: 'red' | 'cyan' }> = ({ label, onClick, color }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded border border-opacity-30 active:scale-95 transition-all 
        ${color === 'red' 
            ? 'bg-red-900/30 border-red-600 text-red-300 hover:bg-red-800/50' 
            : 'bg-cyan-900/30 border-cyan-600 text-cyan-300 hover:bg-cyan-800/50'}`}
    >
        {label}
    </button>
);

const MobileLoanCard: React.FC<MobileLoanCardProps> = ({ currentLoan, energy, bankBonuses, onTakeLoan, onRepayLoan, setShowBankInfoPopup, formatNumber }) => {
    const [amount, setAmount] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Règle des 20% de collatéral
    // Energy >= Loan * 0.20 => MaxLoan = Energy / 0.20
    const maxLoanableAmount = useMemo(() => {
        return Math.floor(energy / 0.20);
    }, [energy]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value.replace(/[^0-9]/g, ''));
    };

    // Actions Emprunt
    const setLoanPercentage = (percent: number) => {
        setAmount(String(Math.floor(maxLoanableAmount * percent)));
    };

    const handleTakeLoan = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onTakeLoan(val);
        setAmount('');
    };

    // Actions Remboursement
    const setRepayPercentage = (percent: number) => {
        if (!currentLoan) return;
        const maxAffordable = Math.min(energy, currentLoan.remaining);
        setAmount(String(Math.floor(maxAffordable * percent)));
    };

    const handleRepay = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onRepayLoan(val);
        setAmount('');
    };

    // --- MODE REMBOURSEMENT (Dette Active) ---
    // Epsilon check to hide panel immediately when paid off
    if (currentLoan && currentLoan.remaining > 1) {
        const repaymentTotal = currentLoan.amount * (1 + bankBonuses.loanInterest);
        const progress = 100 - (currentLoan.remaining / repaymentTotal) * 100;
        
        return (
            <div className="bg-black/30 p-3 rounded-lg border border-red-500/30 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-base text-red-400 font-bold flex items-center gap-2">⚠️ Prêt Actif</h3>
                        <p className="text-[10px] text-red-300/70">Remboursement auto: {(LOAN_REPAYMENT_RATE * 100).toFixed(0)}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl text-white font-mono font-bold">{formatNumber(currentLoan.remaining)}</p>
                        <p className="text-[10px] text-red-400/60">Restant</p>
                    </div>
                </div>

                <div className="w-full bg-black/50 rounded-full h-1.5 mb-3 overflow-hidden">
                    <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-2 bg-red-950/20 p-2 rounded border border-red-500/20">
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="Montant..." 
                        className="w-full bg-black/50 p-2 rounded border border-red-500/30 text-white text-right placeholder:text-gray-600 focus:border-red-400 outline-none text-sm"
                    />
                     <div className="flex gap-2 w-full">
                        <PercentageChip label="25%" onClick={() => setRepayPercentage(0.25)} color="red" />
                        <PercentageChip label="50%" onClick={() => setRepayPercentage(0.50)} color="red" />
                        <PercentageChip label="MAX" onClick={() => setRepayPercentage(1.0)} color="red" />
                    </div>
                    <button onClick={handleRepay} className="w-full py-2 rounded bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase">Rembourser</button>
                </div>
            </div>
        );
    }
    
    // --- MODE EMPRUNT ---
    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="w-full flex justify-between items-center cursor-pointer"
            >
                <h3 className="text-base text-cyan-400 flex items-center gap-2">
                    💰 Contracter un Prêt
                    <button onClick={(e) => { e.stopPropagation(); setShowBankInfoPopup(true); }} className="text-[10px] bg-cyan-900/50 px-1.5 rounded-full text-cyan-200">?</button>
                </h3>
                <ChevronDownIcon className={`w-5 h-5 transition-transform text-cyan-400 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[400px] mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex justify-between text-xs mb-2 px-1">
                    <span className="text-gray-400">Capacité Max (20% Collatéral):</span>
                    <span className="text-cyan-300 font-mono">{formatNumber(maxLoanableAmount)} ⚡</span>
                </div>
                
                <div className="space-y-2 bg-cyan-950/20 p-2 rounded border border-cyan-500/20">
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="Montant..." 
                        className="w-full bg-black/50 p-2 rounded border border-cyan-500/30 text-white text-right placeholder:text-gray-600 focus:border-cyan-400 outline-none text-sm"
                    />
                    <div className="flex gap-2 w-full">
                        <PercentageChip label="25%" onClick={() => setLoanPercentage(0.25)} color="cyan" />
                        <PercentageChip label="50%" onClick={() => setLoanPercentage(0.50)} color="cyan" />
                        <PercentageChip label="MAX" onClick={() => setLoanPercentage(1.0)} color="cyan" />
                    </div>
                    <div className="flex justify-between text-[10px] text-cyan-400/70 px-1">
                        <span>Intérêt: +{(bankBonuses.loanInterest * 100).toFixed(0)}%</span>
                    </div>
                    <button onClick={handleTakeLoan} className="w-full py-2 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs uppercase">Emprunter</button>
                </div>
            </div>
        </div>
    );
};

export default MobileLoanCard;
