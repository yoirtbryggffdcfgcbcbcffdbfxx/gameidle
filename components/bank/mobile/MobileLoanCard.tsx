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

const AmountChip: React.FC<{
    label: string;
    onClick: () => void;
    isActive: boolean;
}> = ({ label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-1 text-xs rounded-full transition-colors ${
            isActive ? 'bg-red-600 text-white' : 'bg-gray-700/70 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

const MobileLoanCard: React.FC<MobileLoanCardProps> = ({ currentLoan, energy, maxEnergy, bankBonuses, onTakeLoan, onRepayLoan, setShowBankInfoPopup, formatNumber, loanTier }) => {
    const [amount, setAmount] = useState('');
    const [activeChip, setActiveChip] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentId = `loan-content-${loanTier}`;
    
    const LOAN_OPTIONS = useMemo(() => {
        const multiplier = Math.pow(1000, loanTier);
        return [
            { label: "Petit Prêt", value: 50000 * multiplier },
            { label: "Prêt Moyen", value: 250000 * multiplier },
            { label: "Gros Prêt", value: 1000000 * multiplier },
        ];
    }, [loanTier]);
    
    const handleTakeLoan = (amount: number) => {
        onTakeLoan(amount);
    };

    const handleChipClick = (label: '25%' | '50%' | 'MAX', sourceAmount: number) => {
        let value = 0;
        if (label === 'MAX') {
            value = sourceAmount;
        } else {
            value = Math.floor(sourceAmount * (parseInt(label) / 100));
        }
        setAmount(String(value));
        setActiveChip(label);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
        setActiveChip(null);
    };
    
    const handleRepay = () => {
        let numericAmount = parseInt(amount, 10);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        numericAmount = Math.min(numericAmount, energy, currentLoan!.remaining);

        if (numericAmount > 0) {
            onRepayLoan(numericAmount);
        }

        setAmount('');
        setActiveChip(null);
    };

    if (currentLoan) {
        const repaymentTotal = currentLoan.amount * (1 + bankBonuses.loanInterest);
        const progress = 100 - (currentLoan.remaining / repaymentTotal) * 100;
        return (
            <div className="bg-black/30 p-3 rounded-lg border border-red-500/30">
                <h3 className="text-base text-red-400 mb-2">⚠️ Prêt Actif</h3>
                <p className="text-xs">Restant à payer:</p>
                <p className="text-2xl text-red-400 font-bold">{formatNumber(currentLoan.remaining)}</p>
                <div className="w-full bg-black/50 rounded-full h-2 my-2">
                    <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[10px] opacity-70 mb-3">Total à rembourser: {formatNumber(repaymentTotal)}</p>

                <div className="space-y-2">
                    <input 
                        type="text" 
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="Montant à rembourser" 
                        className="w-full bg-black/50 p-2 rounded-md border border-[var(--border-color)] text-white text-right placeholder:text-gray-500"
                    />
                     <div className="flex items-center gap-1">
                        {(['25%', '50%', 'MAX'] as const).map(label => <AmountChip key={label} label={label} onClick={() => handleChipClick(label, currentLoan.remaining)} isActive={activeChip === label} />)}
                    </div>
                    <button onClick={handleRepay} className="w-full p-1.5 rounded-md bg-red-700/80 hover:bg-red-600 text-xs">Rembourser</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="w-full flex justify-between items-center text-left cursor-pointer"
                role="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
            >
                <h3 className="text-base text-cyan-400 flex items-center">
                    <span>💰 Contracter un Prêt</span>
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowBankInfoPopup(true); 
                        }} 
                        className="text-xs text-cyan-400 cursor-help p-1 rounded-full bg-cyan-900/50 ml-2"
                        aria-label="Informations sur les prêts"
                    >
                        (i)
                    </button>
                </h3>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
            
            <div 
                id={contentId}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] mt-4' : 'max-h-0'}`}
            >
                <p className="text-xs opacity-70 mb-3 text-center">Limite: {formatNumber(maxEnergy * 0.1)} ⚡</p>
                <div className="space-y-2">
                    {LOAN_OPTIONS.map(opt => (
                         <button key={opt.label} onClick={() => handleTakeLoan(opt.value)} className="w-full p-2 bg-cyan-800/80 hover:bg-cyan-700 transition-colors rounded-lg text-left">
                             <span className="font-bold text-sm">{opt.label}</span>
                             <span className="block text-xs text-cyan-300">{formatNumber(opt.value)} ⚡</span>
                         </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileLoanCard;