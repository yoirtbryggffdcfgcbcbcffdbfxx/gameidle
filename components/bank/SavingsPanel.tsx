import React, { useState } from 'react';

interface SavingsPanelProps {
    savingsBalance: number;
    energy: number;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    formatNumber: (num: number) => string;
}

const AmountSelector: React.FC<{
    selected: number | 'MAX' | null;
    onSelect: (val: number | 'MAX') => void;
}> = ({ selected, onSelect }) => {
    const options: (number | 'MAX')[] = [25, 50, 'MAX'];
    return (
        <div className="bg-black/30 p-1 rounded-md flex items-center gap-1">
            <span className="text-xs px-2">Montant:</span>
            {options.map(amount => (
                <button
                    key={amount}
                    onClick={() => onSelect(typeof amount === 'number' ? amount : 'MAX')}
                    className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${selected === amount ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {typeof amount === 'number' ? `${amount}%` : amount}
                </button>
            ))}
        </div>
    );
};

const SavingsPanel: React.FC<SavingsPanelProps> = ({ savingsBalance, energy, onDeposit, onWithdraw, formatNumber }) => {
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

    const handleTransaction = (action: 'deposit' | 'withdraw') => {
        let amount = 0;
        const sourceAmount = action === 'deposit' ? energy : savingsBalance;

        if (selectedPercent !== null) {
            amount = selectedPercent === 'MAX' ? sourceAmount : Math.floor(sourceAmount * (selectedPercent / 100));
        } else {
            amount = parseInt(customAmount, 10);
        }

        if (isNaN(amount) || amount <= 0) return;

        if (action === 'deposit') onDeposit(amount);
        else onWithdraw(amount);
        
        setCustomAmount('');
        setSelectedPercent(null);
    };

    return (
        <div className="bg-[var(--bg-upgrade)] p-3 sm:p-4 rounded-lg flex flex-col h-full">
            <h3 className="text-base sm:text-lg text-yellow-400 mb-2">🐷 Compte Épargne</h3>
            <p className="text-xs mb-2">Solde:</p>
            <p className="text-xl sm:text-2xl text-green-400 font-bold mb-4">{formatNumber(savingsBalance)} ⚡</p>
            
            <div className="mt-auto space-y-3">
                <input type="text" value={customAmount} onChange={handleCustomAmountChange} placeholder="Montant personnalisé" className="w-full bg-black/50 p-2 rounded border border-[var(--border-color)] text-white text-right"/>
                <AmountSelector selected={selectedPercent} onSelect={handlePercentSelect} />

                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <button onClick={() => handleTransaction('deposit')} className="p-2 rounded bg-green-700 hover:bg-green-600">Déposer</button>
                    
                    <div className="relative group">
                        <button onClick={() => handleTransaction('withdraw')} className="w-full h-full p-2 rounded bg-yellow-700 hover:bg-yellow-600">Retirer</button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-60 mb-2 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            Le retrait de l'épargne remboursera automatiquement tout prêt en cours en priorité.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavingsPanel;