import React, { useState, useMemo } from 'react';

interface MobileSavingsCardProps {
    savingsBalance: number;
    energy: number;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number) => void;
    formatNumber: (num: number) => string;
}

const AmountChip: React.FC<{
    label: string;
    onClick: () => void;
    isActive: boolean;
}> = ({ label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-1 text-xs rounded-full transition-colors ${
            isActive ? 'bg-cyan-600 text-white' : 'bg-gray-700/70 hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);

const MobileSavingsCard: React.FC<MobileSavingsCardProps> = ({ savingsBalance, energy, onDeposit, onWithdraw, formatNumber }) => {
    const [amount, setAmount] = useState('');
    const [activeChip, setActiveChip] = useState<string | null>(null);

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
    
    const handleTransaction = (action: 'deposit' | 'withdraw') => {
        const numericAmount = parseInt(amount, 10);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        if (action === 'deposit') onDeposit(numericAmount);
        else onWithdraw(numericAmount);
        
        setAmount('');
        setActiveChip(null);
    };

    const chips = useMemo(() => ['25%', '50%', 'MAX'] as const, []);

    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <h3 className="text-base text-yellow-400 mb-2">🐷 Compte Épargne</h3>
            <p className="text-2xl text-green-400 font-bold mb-3">{formatNumber(savingsBalance)} ⚡</p>
            
            <div className="space-y-2">
                <input 
                    type="text" 
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={amount} 
                    onChange={handleInputChange} 
                    placeholder="Montant" 
                    className="w-full bg-black/50 p-2 rounded-md border border-[var(--border-color)] text-white text-right placeholder:text-gray-500"
                />

                <div className="grid grid-cols-2 gap-2 text-sm">
                    {/* Deposit */}
                    <div>
                        <div className="text-center text-xs text-gray-400 mb-1">Déposer depuis ⚡</div>
                        <div className="flex items-center gap-1">
                            {chips.map(label => <AmountChip key={label} label={label} onClick={() => handleChipClick(label, energy)} isActive={activeChip === label} />)}
                        </div>
                        <button onClick={() => handleTransaction('deposit')} className="w-full mt-2 p-1.5 rounded-md bg-green-700/80 hover:bg-green-600 text-xs">Déposer</button>
                    </div>

                    {/* Withdraw */}
                    <div>
                        <div className="text-center text-xs text-gray-400 mb-1">Retirer vers ⚡</div>
                        <div className="flex items-center gap-1">
                            {chips.map(label => <AmountChip key={label} label={label} onClick={() => handleChipClick(label, savingsBalance)} isActive={activeChip === label} />)}
                        </div>
                        <button onClick={() => handleTransaction('withdraw')} className="w-full mt-2 p-1.5 rounded-md bg-yellow-700/80 hover:bg-yellow-600 text-xs">Retirer</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSavingsCard;