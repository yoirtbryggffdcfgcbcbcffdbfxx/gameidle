
import React, { useEffect, useState } from 'react';
import { SaveSlotMetadata } from '../../types';
import ChevronLeftIcon from '../ui/ChevronLeftIcon';
import ClockIcon from '../ui/ClockIcon';
import ZapIcon from '../ui/ZapIcon';

interface CloudSlotsPanelProps {
    username: string;
    slots: SaveSlotMetadata[];
    loadingOperation: string | null;
    onSlotAction: (slot: SaveSlotMetadata) => void;
    onLogout: () => void;
    onRefresh: () => void;
    onBack: () => void;
    formatNumber: (n: number) => string;
}

const SlotCardSkeleton = () => (
    <div className="border border-white/5 bg-white/5 p-3 rounded h-[72px] flex items-center animate-pulse">
        <div className="w-8 h-8 bg-white/10 rounded mr-3"></div>
        <div className="flex-grow space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded"></div>
            <div className="h-2 w-16 bg-white/10 rounded"></div>
        </div>
        <div className="w-16 h-6 bg-white/10 rounded"></div>
    </div>
);

// Composant de chargement immersif type "Terminal"
const ProcessingOverlay: React.FC<{ text: string }> = ({ text }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const steps = [
        "CONNEXION UPLINK SECURISEE...",
        "VERIFICATION IDENTITE PILOTE...",
        "ALLOCATION DE FLUX QUANTIQUE...",
        "ECRITURE DES DONNEES DANS LA MATRICE...",
        "SYNCHRONISATION TEMPORELLE...",
        "FINALISATION...",
        "EN ATTENTE DE CONFIRMATION SERVEUR..."
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setLogs(prev => [...prev.slice(-4), steps[i]]);
                i++;
            }
        }, 800); // Un nouveau log toutes les 800ms pour faire patienter
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 bg-black/40 rounded-lg border border-purple-500/30 animate-pulse-slow">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-purple-300 font-bold text-center mb-4 tracking-widest animate-pulse">{text}</h3>
            
            <div className="w-full max-w-xs font-mono text-[10px] text-purple-400/70 space-y-1 h-24 overflow-hidden flex flex-col justify-end border-t border-purple-500/20 pt-2">
                {logs.map((log, idx) => (
                    <div key={idx} className="animate-slide-in-up">
                        <span className="text-purple-600 mr-2">{'>'}</span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CloudSlotsPanel: React.FC<CloudSlotsPanelProps> = ({ 
    username, slots, loadingOperation, onSlotAction, onLogout, onRefresh, onBack, formatNumber 
}) => {
    
    // Si on est en train de charger les slots (initialement), on affiche des squelettes
    // Si une opération lourde (création/chargement de partie) est en cours, on affiche l'overlay
    const isLoadingSlots = loadingOperation === "ANALYSE DES SECTEURS..."; 
    const isHeavyOperation = loadingOperation && !isLoadingSlots;

    return (
        <div className="w-full animate-fade-in h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <button onClick={onBack} disabled={!!loadingOperation} className={`text-cyan-500 hover:text-white flex items-center gap-1 text-xs uppercase tracking-wider ${loadingOperation ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <ChevronLeftIcon className="w-4 h-4" /> Déconnexion
                </button>
                <div className="flex gap-3">
                    <button onClick={onRefresh} disabled={!!loadingOperation} className="text-gray-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider" title="Rafraîchir">
                        ↻
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-3 rounded-lg mb-4 border border-white/10">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Signature Quantique</div>
                <div className="text-lg font-bold text-white font-mono truncate">{username}</div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar pr-1 flex flex-col">
                
                {isHeavyOperation ? (
                    <ProcessingOverlay text={loadingOperation!} />
                ) : (
                    <>
                        {isLoadingSlots && slots.length === 0 ? (
                            <>
                                <SlotCardSkeleton />
                                <SlotCardSkeleton />
                                <SlotCardSkeleton />
                            </>
                        ) : (
                            slots.map(slot => {
                                const isEmpty = slot.isEmpty;
                                return (
                                    <div 
                                        key={slot.slotId} 
                                        className={`
                                            relative overflow-hidden border p-3 rounded-lg flex flex-row items-center justify-between group transition-all duration-300
                                            ${isEmpty 
                                                ? 'border-white/10 bg-transparent hover:bg-white/5 hover:border-white/30 border-dashed' 
                                                : 'border-cyan-500/30 bg-black/40 hover:bg-cyan-900/20 hover:border-cyan-400'
                                            }
                                        `}
                                    >
                                        {/* Slot Info */}
                                        <div className="flex items-center gap-3 relative z-10 flex-grow min-w-0">
                                            <div className={`
                                                w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-inner
                                                ${isEmpty 
                                                    ? 'bg-gray-800 text-gray-500' 
                                                    : 'bg-gradient-to-br from-cyan-600 to-purple-600 text-white ring-1 ring-white/20'
                                                }
                                            `}>
                                                {slot.slotId}
                                            </div>
                                            
                                            <div className="flex flex-col min-w-0 flex-grow mr-2">
                                                {isEmpty ? (
                                                    <span className="text-gray-500 text-xs font-mono tracking-wide">SECTEUR VIERGE</span>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                                            <span className="text-xs text-white font-bold tracking-wide whitespace-nowrap">Ascension {slot.ascensionLevel}</span>
                                                            {slot.timestamp && (
                                                                <span className="text-[9px] text-gray-500 flex items-center gap-0.5 whitespace-nowrap">
                                                                    <ClockIcon className="w-3 h-3" />
                                                                    {new Date(slot.timestamp).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 truncate">
                                                            <ZapIcon className="w-3 h-3" />
                                                            {formatNumber(slot.energy || 0)}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Action Button */}
                                        <button
                                            onClick={() => onSlotAction(slot)}
                                            className={`
                                                relative z-10 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-lg flex-shrink-0
                                                ${isEmpty 
                                                    ? 'bg-green-900/20 text-green-400 border border-green-700/50 hover:bg-green-700 hover:text-white group-hover:opacity-100 opacity-70'
                                                    : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20'
                                                }
                                            `}
                                        >
                                            {isEmpty ? 'Initialiser' : 'Charger'}
                                        </button>

                                        {/* Background Decoration */}
                                        {!isEmpty && (
                                            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CloudSlotsPanel;
