
import React, { useState } from 'react';
import { useGameContext } from '../../../contexts/GameContext';

interface MobileSavingsCardProps {
    savingsBalance: number;
    energy: number;
    onDeposit: (amount: number) => void;
    onWithdraw: (amount: number, repayLoan: boolean) => void;
    formatNumber: (num: number) => string;
}

const AmountChip: React.FC<{
    label: string;
    onClick: () => void;
    isActive: boolean;
}> = ({ label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-2 py-2 text-[10px] rounded-sm transition-colors border border-opacity-20 ${
            isActive 
            ? 'bg-cyan-700 text-white border-cyan-500' 
            : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

const MobileSavingsCard: React.FC<MobileSavingsCardProps> = ({ savingsBalance, energy, onDeposit, onWithdraw, formatNumber }) => {
    const { gameState } = useGameContext();
    const currentLoan = gameState.currentLoan;

    const [amount, setAmount] = useState('');
    const [activeChip, setActiveChip] = useState<string | null>(null);
    const [confirmState, setConfirmState] = useState<{ active: boolean, amount: number }>({ active: false, amount: 0 });

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
    
    const handleDepositClick = () => {
        const val = parseInt(amount, 10);
        if (!isNaN(val) && val > 0) onDeposit(val);
        setAmount('');
        setActiveChip(null);
    }

    const handleWithdrawClick = () => {
        const val = parseInt(amount, 10);
        if (isNaN(val) || val <= 0) return;

        if (currentLoan && currentLoan.remaining > 1) {
            setConfirmState({ active: true, amount: val });
        } else {
            onWithdraw(val, false);
            setAmount('');
            setActiveChip(null);
        }
    };

    const handleConfirmWithdraw = (repayLoan: boolean) => {
        if (confirmState.amount > 0) {
            onWithdraw(confirmState.amount, repayLoan);
        }
        setConfirmState({ active: false, amount: 0 });
        setAmount('');
        setActiveChip(null);
    };

    // UI de Confirmation
    if (confirmState.active) {
        return (
            <div className="bg-black/40 p-4 rounded-lg border border-yellow-500/50 text-center animate-fade-in-fast">
                <p className="text-yellow-400 font-bold text-sm mb-2">Dette Active !</p>
                <p className="text-xs text-gray-300 mb-4">Rembourser le prêt avec ce retrait ?</p>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleConfirmWithdraw(true)} className="bg-green-700 text-white py-2 rounded text-xs font-bold">OUI</button>
                    <button onClick={() => handleConfirmWithdraw(false)} className="bg-gray-700 text-white py-2 rounded text-xs font-bold">NON</button>
                </div>
                <button onClick={() => setConfirmState({ active: false, amount: 0 })} className="mt-3 text-[10px] text-red-400 underline">Annuler</button>
            </div>
        );
    }

    return (
        <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm text-green-400 font-bold">🐷 Épargne</h3>
                <p className="text-xl text-white font-mono font-bold">{formatNumber(savingsBalance)}</p>
            </div>
            
            <div className="space-y-4">
                <input 
                    type="text" 
                    inputMode="numeric"
                    value={amount} 
                    onChange={handleInputChange} 
                    placeholder="0" 
                    className="w-full bg-black/50 p-2 rounded border border-gray-700 text-white text-right focus:border-green-500 outline-none text-sm font-mono"
                />

                {/* Mobile Layout: Vertical Stack to avoid overlapping buttons */}
                <div className="flex flex-col gap-4">
                    {/* Deposit */}
                    <div className="bg-green-900/10 p-3 rounded border border-green-900/30">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] text-green-500 font-bold">DÉPOSER</span>
                             <span className="text-[9px] text-green-500/60">MAX: {formatNumber(energy)}</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            {['25%', '50%', 'MAX'].map((lbl) => (
                                <AmountChip key={lbl} label={lbl} onClick={() => handleChipClick(lbl as any, energy)} isActive={activeChip === lbl && amount !== ''} />
                            ))}
                        </div>
                        <button onClick={handleDepositClick} className="w-full bg-green-700 hover:bg-green-600 text-white text-xs py-2 rounded font-bold uppercase tracking-wider shadow-md">Valider Dépôt</button>
                    </div>

                    {/* Withdraw */}
                    <div className="bg-yellow-900/10 p-3 rounded border border-yellow-900/30">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] text-yellow-500 font-bold">RETIRER</span>
                             <span className="text-[9px] text-yellow-500/60">DISPO: {formatNumber(savingsBalance)}</span>
                        </div>
                         <div className="flex gap-2 mb-3">
                            {['25%', '50%', 'MAX'].map((lbl) => (
                                <AmountChip key={lbl} label={lbl} onClick={() => handleChipClick(lbl as any, savingsBalance)} isActive={activeChip === lbl && amount !== ''} />
                            ))}
                        </div>
                        <button onClick={handleWithdrawClick} className="w-full bg-yellow-700 hover:bg-yellow-600 text-white text-xs py-2 rounded font-bold uppercase tracking-wider shadow-md">Valider Retrait</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSavingsCard;
