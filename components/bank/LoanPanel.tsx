import React, { useState, useEffect, useMemo } from 'react';
import { GameState } from '../../types';
import { LOAN_REPAYMENT_RATE } from '../../data/bank';

interface LoanPanelProps {
    currentLoan: GameState['currentLoan'];
    energy: number;
    bankBonuses: { loanInterest: number; savingsInterest: number };
    onTakeLoan: (amount: number) => void;
    onRepayLoan: (amount: number) => void;
    setShowBankInfoPopup: (show: boolean) => void;
    formatNumber: (num: number) => string;
}

const AmountSelector: React.FC<{
    selected: number | 'MAX' | null;
    onSelect: (val: number | 'MAX') => void;
    loanRemaining: number;
}> = ({ selected, onSelect, loanRemaining }) => {
    const options: (number | 'MAX')[] = [25, 50, 'MAX'];
    return (
        <div className="bg-black/30 p-1 rounded-md flex items-center gap-1">
            <span className="text-xs px-2">Rembourser:</span>
            {options.map(amount => (
                <button
                    key={amount}
                    onClick={() => onSelect(typeof amount === 'number' ? amount : 'MAX')}
                    className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${selected === amount ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {typeof amount === 'number' ? `${amount}%` : amount}
                </button>
            ))}
        </div>
    );
};


const RepaymentSection: React.FC<{
    currentLoan: NonNullable<GameState['currentLoan']>;
    energy: number;
    formatNumber: (num: number) => string;
    onRepayLoan: (amount: number) => void;
}> = ({ currentLoan, energy, formatNumber, onRepayLoan }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPercent, setSelectedPercent] = useState<number | 'MAX' | null>(null);

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        if (value) {
            setSelectedPercent(null);
        }
    };

    const handlePercentSelect = (val: number | 'MAX') => {
        setSelectedPercent(val);
        setCustomAmount('');
    };

    const calculatedAmountToRepay = useMemo(() => {
        let targetRepayment = 0;
        if (selectedPercent !== null) {
            targetRepayment = selectedPercent === 'MAX' ? currentLoan.remaining : Math.floor(currentLoan.remaining * (selectedPercent / 100));
        } else {
            targetRepayment = parseInt(customAmount, 10) || 0;
        }
        return Math.min(energy, targetRepayment);
    }, [selectedPercent, customAmount, energy, currentLoan.remaining]);

    const handleRepay = () => {
        if (calculatedAmountToRepay <= 0) return;
        onRepayLoan(calculatedAmountToRepay);
        setCustomAmount('');
        setSelectedPercent(null);
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-sm text-yellow-400">Remboursement Manuel</h4>
            <input type="text" value={customAmount} onChange={handleCustomAmountChange} placeholder="Montant personnalisé" className="w-full bg-black/50 p-2 rounded border border-[var(--border-color)] text-white text-right"/>
            <AmountSelector selected={selectedPercent} onSelect={handlePercentSelect} loanRemaining={currentLoan.remaining} />
            <div className="relative group mt-2">
                <button onClick={handleRepay} disabled={calculatedAmountToRepay <= 0} className="w-full p-2 rounded bg-red-700 hover:enabled:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm">Rembourser</button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-max mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    Rembourser {formatNumber(calculatedAmountToRepay)} ⚡
                </div>
            </div>
        </div>
    );
};

const LoanPanel: React.FC<LoanPanelProps> = ({ currentLoan, energy, bankBonuses, onTakeLoan, onRepayLoan, setShowBankInfoPopup, formatNumber }) => {
    const [loanAmount, setLoanAmount] = useState('');
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    const LOAN_OPTIONS = useMemo(() => {
        const maxEnergy = 1e9 * Math.pow(10, (window as any).gameState?.ascensionLevel || 0); // A simple way to get a rough max for options
        return [50000, 250000, 1000000].filter(o => o < maxEnergy * 0.1);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFirstVisit(false);
        }, 3000); 
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
        <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg flex flex-col h-full">
            {currentLoan ? (
                <>
                    <h3 className="text-base sm:text-lg text-red-400 mb-2">⚠️ Prêt Actif</h3>
                    <div className="text-xs space-y-1">
                        <p>Restant à payer: <strong className="text-red-400 text-lg sm:text-xl">{formatNumber(currentLoan.remaining)}</strong></p>
                        <div className="w-full bg-black/50 rounded-full h-2.5 my-1">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${100 - (currentLoan.remaining / (currentLoan.amount * (1 + bankBonuses.loanInterest))) * 100}%`}}></div>
                        </div>
                        <p className="opacity-70">Total à rembourser: {formatNumber(currentLoan.amount * (1 + bankBonuses.loanInterest))}</p>
                        <p className="opacity-80"><strong className="text-cyan-400">{LOAN_REPAYMENT_RATE * 100}%</strong> de votre prod. est utilisé pour le remboursement auto.</p>
                    </div>
                    <RepaymentSection 
                        currentLoan={currentLoan}
                        energy={energy}
                        formatNumber={formatNumber}
                        onRepayLoan={onRepayLoan}
                    />
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