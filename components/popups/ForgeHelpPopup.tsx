
import React from 'react';
import Popup from './Popup';

interface ForgeHelpPopupProps {
    onClose: () => void;
}

const ForgeHelpPopup: React.FC<ForgeHelpPopupProps> = ({ onClose }) => {
    return (
        <Popup title="Manuel Technique : La Forge" onClose={onClose} widthClass="w-[600px]">
            <div className="space-y-4 text-sm font-mono text-gray-300 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                
                {/* Section 1: Analyse des Données (Unit vs Gain) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-cyan-900/10 p-3 rounded border border-cyan-500/30 flex flex-col h-full">
                        <h4 className="text-cyan-400 font-bold mb-2 uppercase tracking-wider text-xs border-b border-cyan-500/20 pb-1 flex items-center justify-between">
                            <span>UNITAIRE</span>
                            <span className="text-[10px] opacity-50">STATIQUE</span>
                        </h4>
                        <p className="text-[10px] text-cyan-100 leading-relaxed flex-grow">
                            La puissance brute d'une <strong className="text-white">seule machine</strong> à son niveau d'évolution (Tier) actuel.
                        </p>
                        <div className="mt-2 bg-black/40 p-1.5 rounded text-[9px] text-cyan-400/80 italic border-l-2 border-cyan-500">
                            "Quelle est la qualité technologique de ce modèle ?"
                        </div>
                    </div>

                    <div className="bg-green-900/10 p-3 rounded border border-green-500/30 flex flex-col h-full">
                        <h4 className="text-green-400 font-bold mb-2 uppercase tracking-wider text-xs border-b border-green-500/20 pb-1 flex items-center justify-between">
                            <span>GAIN</span>
                            <span className="text-[10px] opacity-50">DYNAMIQUE</span>
                        </h4>
                        <p className="text-[10px] text-green-100 leading-relaxed flex-grow">
                            L'énergie qui sera <strong className="text-white">ajoutée au total</strong> si vous cliquez sur le bouton d'achat maintenant.
                        </p>
                        <div className="mt-2 bg-black/40 p-1.5 rounded text-[9px] text-green-400/80 italic border-l-2 border-green-500">
                            Dépend de la quantité (x1, x10...) et des bonus de Tier.
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10 my-2"></div>

                {/* Section 2: Mécanique des Coûts */}
                <div className="bg-black/40 p-3 rounded border-l-2 border-yellow-500">
                    <h4 className="text-yellow-400 font-bold mb-1 uppercase tracking-wider text-xs">Algorithme de Prix</h4>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="bg-black/50 px-3 py-2 rounded border border-gray-700 font-mono text-yellow-200">
                            Prix = Base × 1.15<sup className="text-[8px]">Niveau</sup>
                        </div>
                        <p className="text-[10px] italic opacity-70 flex-grow">
                            Le coût augmente de <strong className="text-white">15%</strong> à chaque achat.<br/>
                            Il double environ tous les 5 niveaux.
                        </p>
                    </div>
                </div>

                {/* Section 3: Évolution et Tiers */}
                <div className="bg-black/40 p-3 rounded border-l-2 border-purple-500 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -right-4 -top-4 text-purple-900/20 text-9xl font-black select-none pointer-events-none">MK</div>

                    <h4 className="text-purple-400 font-bold mb-2 uppercase tracking-wider text-xs">Protocole d'Évolution (Tiers)</h4>
                    <p className="text-[10px] mb-3 relative z-10">
                        Tous les <strong className="text-white">10 niveaux</strong>, le système atteint un seuil critique nécessitant une <span className="text-yellow-400 font-bold">ÉVOLUTION</span> manuelle.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                        <div className="bg-purple-900/20 p-2 rounded border border-purple-500/20">
                            <span className="block text-[8px] text-purple-300 uppercase mb-1">Coût Évolution</span>
                            <span className="block text-xs font-bold text-white">10x</span>
                            <span className="block text-[8px] text-gray-500">le prix actuel</span>
                        </div>
                        <div className="bg-purple-900/20 p-2 rounded border border-purple-500/20">
                            <span className="block text-[8px] text-purple-300 uppercase mb-1">Bonus Prod.</span>
                            <span className="block text-xs font-bold text-white">x3</span>
                            <span className="block text-[8px] text-gray-500">Permanent</span>
                        </div>
                        <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
                            <span className="block text-[8px] text-green-300 uppercase mb-1">Remise Future</span>
                            <span className="block text-xs font-bold text-white">-90%</span>
                            <span className="block text-[8px] text-gray-500">Sur le niv. suivant</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onClose} 
                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 py-3 rounded uppercase font-bold text-xs tracking-widest transition-all mt-2"
                >
                    Fermer le Manuel
                </button>
            </div>
        </Popup>
    );
};

export default ForgeHelpPopup;
