import React from 'react';
import QuantumFragmentIcon from '../ui/QuantumFragmentIcon';

const QuantumFragmentCard: React.FC<{
    quantumShards: number;
    energy: number;
    onBuy: () => void;
    formatNumber: (num: number) => string;
    cost: number;
}> = ({ quantumShards, energy, onBuy, formatNumber, cost }) => {
    
    const canAfford = energy >= cost;

    return (
        <div className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center relative shadow-lg shadow-purple-500/10">
            <QuantumFragmentIcon className="w-16 h-16 animate-core-breathe" style={{animationDuration: '3s'}} />
            <div className="flex-grow text-center md:text-left">
                <h4 className="text-lg font-bold text-purple-300">Fragment Quantique</h4>
                <p className="text-sm opacity-80 mt-1">Utilisé pour améliorer le Cœur et débloquer son plein potentiel. Le coût augmente à chaque achat.</p>
                <p className="text-sm mt-2">Vous possédez : <strong className="text-purple-300">{formatNumber(quantumShards)} FQ</strong></p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
                <button
                    onClick={onBuy}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform text-white
                        ${canAfford
                            ? 'bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/20 hover:brightness-110 hover:shadow-purple-400/40 active:scale-95'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    <span className="block">Acheter (+1 FQ)</span>
                    <span className="block text-xs opacity-80">Coût: {formatNumber(cost)} ⚡</span>
                </button>
            </div>
        </div>
    );
};

export default QuantumFragmentCard;