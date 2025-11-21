
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

const PercentageButton: React.FC<{ label: string; onClick: () => void; colorClass: string }> = ({ label, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-2.5 text-xs font-bold rounded-md border border-opacity-30 transition-all active:scale-95 ${colorClass}`}
    >
        {label}
    </button>
);

const LoanPanel: React.FC<LoanPanelProps> = ({ currentLoan, energy, bankBonuses, onTakeLoan, onRepayLoan, setShowBankInfoPopup, formatNumber }) => {
    const [amount, setAmount] = useState('');

    // --- LOGIQUE D'EMPRUNT ---
    // Règle : Il faut avoir 20% du montant emprunté comme collatéral (apport).
    // Donc MontantMax = Énergie / 0.20
    const maxLoanableAmount = useMemo(() => {
        return Math.floor(energy / 0.20);
    }, [energy]);

    const handleSetLoanAmount = (percent: number) => {
        const val = Math.floor(maxLoanableAmount * percent);
        setAmount(String(val));
    };

    const handleTakeLoanClick = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onTakeLoan(val);
        setAmount('');
    };

    // --- LOGIQUE DE REMBOURSEMENT ---
    const handleSetRepayAmount = (percent: number) => {
        if (!currentLoan) return;
        // On ne peut pas rembourser plus que ce qu'on a, ni plus que ce qu'on doit
        const maxAffordable = Math.min(energy, currentLoan.remaining);
        const val = Math.floor(maxAffordable * percent);
        setAmount(String(val));
    };

    const handleRepayClick = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onRepayLoan(val);
        setAmount('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value.replace(/[^0-9]/g, ''));
    };

    // --- AFFICHAGE : DETTE ACTIVE ---
    if (currentLoan && currentLoan.remaining > 0.1) { // Check epsilon strict
        const repaymentTotal = currentLoan.amount * (1 + bankBonuses.loanInterest);
        const progress = Math.max(0, 100 - (currentLoan.remaining / repaymentTotal) * 100);
        
        return (
            <div className="bg-[#0a0a0f] p-4 rounded-lg flex flex-col border border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.1)] min-h-full relative">
                {/* Background Alert Effect */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-9xl text-red-600 font-black">!</span>
                </div>

                <div className="flex justify-between items-center mb-4 border-b border-red-900/30 pb-2">
                    <h3 className="text-lg text-red-400 font-bold flex items-center gap-2">
                        <span>Dette Active</span>
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                    </h3>
                    <div className="text-right">
                        <div className="text-[10px] text-red-300/60 uppercase">Restant Dû</div>
                        <div className="text-xl font-mono text-red-100">{formatNumber(currentLoan.remaining)}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-red-400 mb-1">
                        <span>Progression Remboursement</span>
                        <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-3 border border-red-900/30 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-red-900 to-red-600 h-full transition-all duration-500 ease-out" 
                            style={{width: `${progress}%`}}
                        ></div>
                    </div>
                    <p className="text-[10px] text-red-500/60 mt-1 text-center">
                        Prélèvement auto: {(LOAN_REPAYMENT_RATE * 100).toFixed(0)}% de la production
                    </p>
                </div>

                {/* Controls */}
                <div className="mt-auto bg-red-950/10 p-3 rounded border border-red-900/30 space-y-3">
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="Montant à rembourser..." 
                        className="w-full bg-black/50 p-3 rounded border border-red-800/50 text-white text-right placeholder:text-red-900/50 focus:border-red-500 focus:outline-none font-mono"
                    />
                    
                    <div className="flex gap-2">
                        <PercentageButton label="25%" onClick={() => handleSetRepayAmount(0.25)} colorClass="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-800/40" />
                        <PercentageButton label="50%" onClick={() => handleSetRepayAmount(0.50)} colorClass="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-800/40" />
                        <PercentageButton label="MAX" onClick={() => handleSetRepayAmount(1.0)} colorClass="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-800/40" />
                    </div>

                    <button 
                        onClick={handleRepayClick} 
                        className="w-full py-3 rounded bg-gradient-to-r from-red-700 to-red-900 text-white font-bold uppercase tracking-wider hover:from-red-600 hover:to-red-800 transition-all shadow-lg shadow-red-900/20"
                    >
                        Effectuer Paiement
                    </button>
                </div>
            </div>
        );
    }
    
    // --- AFFICHAGE : CONTRACTER UN PRÊT ---
    return (
        <div className="bg-[#0a0a0f] p-4 rounded-lg flex flex-col border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] min-h-full relative">
             <div className="flex justify-between items-start mb-4 border-b border-cyan-900/30 pb-2">
                <div>
                    <h3 className="text-lg text-cyan-400 font-bold flex items-center gap-2">
                        Contracter un Prêt
                        <button onClick={() => setShowBankInfoPopup(true)} className="text-xs bg-cyan-900/50 w-5 h-5 rounded-full flex items-center justify-center hover:bg-cyan-800 text-cyan-200">?</button>
                    </h3>
                    <p className="text-[10px] text-cyan-300/60 mt-1">Collatéral requis : 20%</p>
                </div>
                <div className="text-right">
                     <div className="text-[10px] text-cyan-300/60 uppercase">Capacité d'Emprunt</div>
                     <div className="text-sm font-mono text-cyan-100">{formatNumber(maxLoanableAmount)} ⚡</div>
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-center space-y-4 bg-cyan-950/10 p-3 rounded border border-cyan-900/30">
                <div className="space-y-1">
                    <label className="text-xs text-cyan-500 font-bold">Montant Souhaité</label>
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="0" 
                        className="w-full bg-black/50 p-3 rounded border border-cyan-800/50 text-white text-right placeholder:text-cyan-900/50 focus:border-cyan-500 focus:outline-none font-mono text-lg"
                    />
                </div>

                <div className="flex gap-2">
                    <PercentageButton label="25%" onClick={() => handleSetLoanAmount(0.25)} colorClass="bg-cyan-900/20 border-cyan-700 text-cyan-400 hover:bg-cyan-800/40" />
                    <PercentageButton label="50%" onClick={() => handleSetLoanAmount(0.50)} colorClass="bg-cyan-900/20 border-cyan-700 text-cyan-400 hover:bg-cyan-800/40" />
                    <PercentageButton label="MAX" onClick={() => handleSetLoanAmount(1.0)} colorClass="bg-cyan-900/20 border-cyan-700 text-cyan-400 hover:bg-cyan-800/40" />
                </div>

                <div className="pt-2 border-t border-cyan-900/30">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">Intérêts</span>
                        <span className="text-red-400">+{(bankBonuses.loanInterest * 100).toFixed(0)}%</span>
                    </div>
                    <button 
                        onClick={handleTakeLoanClick} 
                        className="w-full py-3 rounded bg-gradient-to-r from-cyan-700 to-blue-800 text-white font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-900/20"
                    >
                        Signer le Contrat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanPanel;
