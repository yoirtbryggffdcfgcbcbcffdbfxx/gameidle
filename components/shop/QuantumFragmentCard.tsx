
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
    const progress = Math.min((energy / cost) * 100, 100);

    return (
        <div className="w-full max-w-2xl mx-auto bg-[#0d0b14] border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)] relative group">
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            
            <div className="flex flex-col md:flex-row">
                {/* Icon Section */}
                <div className="md:w-1/3 bg-black/30 flex items-center justify-center p-6 relative overflow-hidden border-b md:border-b-0 md:border-r border-purple-500/20">
                    <div className="absolute inset-0 bg-purple-900/10 animate-pulse"></div>
                    <QuantumFragmentIcon className="w-24 h-24 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                </div>

                {/* Info & Action Section */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between relative">
                    
                    <div>
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h4 className="text-xl font-bold text-purple-200 tracking-wide uppercase font-mono">Synthétiseur Quantique</h4>
                                <span className="text-[10px] text-purple-400/60 font-mono">MATIÈRE INSTABLE // CLASSE-S</span>
                             </div>
                             <div className="text-right">
                                 <div className="text-[10px] text-purple-400/60 uppercase font-mono">Stock Actuel</div>
                                 <div className="text-2xl font-bold text-white font-mono leading-none">{formatNumber(quantumShards)}</div>
                             </div>
                        </div>
                        
                        <p className="text-purple-200/70 text-xs leading-relaxed mb-6 max-w-sm">
                            Condensez l'énergie brute pour stabiliser un Fragment Quantique. Nécessaire pour l'évolution du Cœur.
                        </p>
                    </div>

                    {/* Progress & Button Area */}
                    <div className="space-y-3">
                        {/* Progress Bar Visual */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-purple-300 uppercase">
                                <span>Énergie Requise</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                                <div 
                                    className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(192,38,211,0.5)]" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                                <span className={canAfford ? 'text-green-400' : 'text-gray-500'}>{formatNumber(energy)} ⚡</span>
                                <span className="text-purple-300">{formatNumber(cost)} ⚡</span>
                            </div>
                        </div>

                        <button
                            onClick={onBuy}
                            disabled={!canAfford}
                            className={`
                                w-full py-3 px-4 rounded text-sm font-bold tracking-widest uppercase transition-all duration-300
                                flex items-center justify-center gap-2
                                ${canAfford
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] scale-100 hover:scale-[1.02]'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                }
                            `}
                        >
                            {canAfford ? (
                                <>
                                    <span className="w-2 h-2 bg-white rounded-full animate-ping mr-1"></span>
                                    Lancer la Synthèse
                                </>
                            ) : (
                                'Énergie Insuffisante'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuantumFragmentCard;
