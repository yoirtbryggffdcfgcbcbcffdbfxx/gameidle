import React, { useState } from 'react';

interface SavingsPanelProps {
    savingsBalance: number;
    energy: number;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    formatNumber: (num: number) => string;
    bankBonuses: { savingsInterest: number };
}

const AmountChip: React.FC<{
    label: string;
    onClick: () => void;
    color: 'green' | 'yellow';
}> = ({ label, onClick, color }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-1 text-xs rounded-full transition-colors ${
            color === 'green' ? 'bg-green-900/70 hover:bg-green-800/70' : 'bg-yellow-900/70 hover:bg-yellow-800/70'
        }`}
    >
        {label}
    </button>
);


const SavingsPanel: React.FC<SavingsPanelProps> = ({ savingsBalance, energy, onDeposit, onWithdraw, formatNumber, bankBonuses }) => {
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
    };

    const setAmountFromPercent = (percent: number, source: 'energy' | 'savings') => {
        const sourceAmount = source === 'energy' ? energy : savingsBalance;
        const value = Math.floor(sourceAmount * percent);
        setAmount(String(value));
    };
    
    const handleTransaction = (action: 'deposit' | 'withdraw') => {
        const numericAmount = parseInt(amount, 10);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        if (action === 'deposit') onDeposit(numericAmount);
        else onWithdraw(numericAmount);
        
        setAmount('');
    };

    return (
        <div className="bg-[var(--bg-upgrade)] p-4 rounded-lg flex flex-col border border-green-500/30 shadow-lg">
            <h3 className="text-lg text-green-300 mb-1 flex items-center gap-2">
                <span className="text-2xl">🐷</span> Compte Épargne
            </h3>
            <p className="text-3xl text-green-400 font-bold">{formatNumber(savingsBalance)} ⚡</p>
            <p className="text-xs text-green-400/80 mb-4">Taux: +{(bankBonuses.savingsInterest * 100).toFixed(2)}%/s</p>
            
            <div className="mt-auto space-y-3">
                <input 
                    type="text" 
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={amount} 
                    onChange={handleAmountChange} 
                    placeholder="Montant..." 
                    className="w-full bg-black/50 p-2 rounded-md border border-[var(--border-color)] text-white text-right placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400 focus:ring-1 outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                    {/* Deposit Controls */}
                    <div className="space-y-2">
                         <div className="flex items-center gap-1">
                            <AmountChip label="50%" onClick={() => setAmountFromPercent(0.5, 'energy')} color="green" />
                            <AmountChip label="MAX" onClick={() => setAmountFromPercent(1, 'energy')} color="green" />
                        </div>
                        <button onClick={() => handleTransaction('deposit')} className="w-full p-2 rounded-md bg-green-700/80 hover:bg-green-600 transition-colors font-bold">Déposer</button>
                    </div>

                    {/* Withdraw Controls */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <AmountChip label="50%" onClick={() => setAmountFromPercent(0.5, 'savings')} color="yellow" />
                            <AmountChip label="MAX" onClick={() => setAmountFromPercent(1, 'savings')} color="yellow" />
                        </div>
                        <div className="relative group w-full">
                            <button onClick={() => handleTransaction('withdraw')} className="w-full p-2 rounded-md bg-yellow-700/80 hover:bg-yellow-600 transition-colors font-bold">Retirer</button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-60 mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                Le retrait de l'épargne remboursera automatiquement tout prêt en cours en priorité.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsPanel;
