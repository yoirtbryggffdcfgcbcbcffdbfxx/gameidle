
import React, { useState } from 'react';
import { GameState } from '../../types';

interface SavingsPanelProps {
    savingsBalance: number;
    energy: number;
    currentLoan: GameState['currentLoan'];
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number, repayLoan: boolean) => void;
    formatNumber: (num: number) => string;
    bankBonuses: { savingsInterest: number };
}

const PercentBtn: React.FC<{ label: string; onClick: () => void; variant: 'green' | 'yellow' }> = ({ label, onClick, variant }) => {
    const colors = variant === 'green' 
        ? 'bg-green-900/20 border-green-700 text-green-400 hover:bg-green-800/40'
        : 'bg-yellow-900/20 border-yellow-700 text-yellow-400 hover:bg-yellow-800/40';
        
    return (
        <button
            onClick={onClick}
            className={`flex-1 px-2 py-2.5 text-[10px] md:text-xs font-bold rounded-sm border border-opacity-50 transition-all active:scale-95 ${colors}`}
        >
            {label}
        </button>
    );
};

const SavingsPanel: React.FC<SavingsPanelProps> = ({ savingsBalance, energy, currentLoan, onDeposit, onWithdraw, formatNumber, bankBonuses }) => {
    const [amount, setAmount] = useState('');
    const [confirmState, setConfirmState] = useState<{ active: boolean, amount: number }>({ active: false, amount: 0 });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value.replace(/[^0-9]/g, ''));
    };

    const setDepositPercent = (pct: number) => setAmount(String(Math.floor(energy * pct)));
    const setWithdrawPercent = (pct: number) => setAmount(String(Math.floor(savingsBalance * pct)));

    const handleDeposit = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onDeposit(val);
        setAmount('');
    };

    const handleWithdrawRequest = () => {
        const val = parseInt(amount, 10);
        if (isNaN(val) || val <= 0) return;

        // Si dette active, on déclenche le mode confirmation UI
        if (currentLoan && currentLoan.remaining > 1) {
            setConfirmState({ active: true, amount: val });
        } else {
            // Sinon retrait direct
            onWithdraw(val, false);
            setAmount('');
        }
    };

    const handleConfirmWithdraw = (repayLoan: boolean) => {
        if (confirmState.amount > 0) {
            onWithdraw(confirmState.amount, repayLoan);
        }
        setConfirmState({ active: false, amount: 0 });
        setAmount('');
    };

    // --- UI DE CONFIRMATION (Overlay In-Component) ---
    if (confirmState.active) {
        return (
            <div className="bg-[#051005] p-6 rounded-lg border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] flex flex-col items-center text-center h-full justify-center animate-fade-in-fast">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl text-yellow-400 font-bold mb-2">Dette Active Détectée</h3>
                <p className="text-gray-300 text-sm mb-6">
                    Vous avez un prêt en cours. Souhaitez-vous utiliser ce retrait de <strong className="text-white">{formatNumber(confirmState.amount)}</strong> pour le rembourser en priorité ?
                </p>
                
                <div className="w-full space-y-3">
                    <button 
                        onClick={() => handleConfirmWithdraw(true)}
                        className="w-full py-3 rounded bg-green-700 hover:bg-green-600 text-white font-bold uppercase tracking-wider shadow-lg"
                    >
                        Oui, Rembourser Dette
                    </button>
                    <button 
                        onClick={() => handleConfirmWithdraw(false)}
                        className="w-full py-3 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold uppercase tracking-wider border border-gray-500"
                    >
                        Non, Retirer vers Énergie
                    </button>
                    <button 
                        onClick={() => setConfirmState({ active: false, amount: 0 })}
                        className="text-xs text-red-400 hover:text-red-300 underline mt-2"
                    >
                        Annuler l'opération
                    </button>
                </div>
            </div>
        );
    }

    // --- UI NORMALE (TERMINAL STYLE) ---
    return (
        <div className="bg-[#051005] p-4 rounded-lg flex flex-col border border-green-900/50 shadow-[0_0_20px_rgba(22,163,74,0.1)] min-h-full relative">
            {/* Decorative Matrix Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b border-green-900/30 pb-2">
                <div>
                    <h3 className="text-lg text-green-400 font-bold flex items-center gap-2 font-mono">
                        <span>[COFFRE_FORT]</span>
                    </h3>
                    <p className="text-[10px] text-green-600/80 font-mono mt-1">SECURISE PAR CHIFFREMENT QUANTIQUE</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-green-500/60 uppercase">Solde Disponible</div>
                    <div className="text-2xl font-mono text-green-100 font-bold tracking-tight">{formatNumber(savingsBalance)} ⚡</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-900/10 p-2 rounded border border-green-800/30 text-center">
                    <div className="text-[10px] text-green-500 uppercase mb-1">Taux Intérêt</div>
                    <div className="text-lg font-bold text-green-300">+{(bankBonuses.savingsInterest * 100).toFixed(2)}% <span className="text-xs text-green-600">/s</span></div>
                </div>
                <div className="bg-green-900/10 p-2 rounded border border-green-800/30 text-center">
                    <div className="text-[10px] text-green-500 uppercase mb-1">Gain Estimé</div>
                    <div className="text-lg font-bold text-green-300">+{formatNumber(savingsBalance * bankBonuses.savingsInterest * 10)} <span className="text-xs text-green-600">/s</span></div>
                </div>
            </div>

            {/* Controls Container */}
            <div className="mt-auto space-y-4 bg-green-950/20 p-4 rounded border border-green-900/30">
                <div className="relative">
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={amount} 
                        onChange={handleInputChange} 
                        placeholder="ENTRER MONTANT..." 
                        className="w-full bg-black/60 p-3 pl-4 rounded border border-green-800/50 text-green-100 text-right placeholder:text-green-900/50 focus:border-green-500 focus:outline-none font-mono tracking-widest text-lg"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-800 font-bold">$</div>
                </div>

                {/* Layout Fix: Stack vertically on small/medium screens, side-by-side only on large screens or if space permits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                    {/* Deposit Column */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-green-600 font-mono">
                            <span>DEPUIS ÉNERGIE</span>
                        </div>
                        <div className="flex gap-2">
                            <PercentBtn label="25%" onClick={() => setDepositPercent(0.25)} variant="green" />
                            <PercentBtn label="50%" onClick={() => setDepositPercent(0.50)} variant="green" />
                            <PercentBtn label="MAX" onClick={() => setDepositPercent(1.0)} variant="green" />
                        </div>
                        <button 
                            onClick={handleDeposit} 
                            className="w-full py-3 rounded bg-green-800 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-green-600 shadow-lg shadow-green-900/20"
                        >
                            DÉPOSER 📥
                        </button>
                    </div>

                    {/* Withdraw Column */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-yellow-600 font-mono">
                            <span>VERS ÉNERGIE</span>
                        </div>
                        <div className="flex gap-2">
                            <PercentBtn label="25%" onClick={() => setWithdrawPercent(0.25)} variant="yellow" />
                            <PercentBtn label="50%" onClick={() => setWithdrawPercent(0.50)} variant="yellow" />
                            <PercentBtn label="MAX" onClick={() => setWithdrawPercent(1.0)} variant="yellow" />
                        </div>
                        <button 
                            onClick={handleWithdrawRequest} 
                            className="w-full py-3 rounded bg-yellow-800 hover:bg-yellow-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-yellow-600 shadow-lg shadow-yellow-900/20"
                        >
                            RETIRER 📤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsPanel;
