import React, { useState } from 'react';

interface LauncherProps {
    onSelect: (mode: 'legacy' | 'v2') => void;
}

const Launcher: React.FC<LauncherProps> = ({ onSelect }) => {
    const [hovered, setHovered] = useState<'legacy' | 'v2' | null>(null);

    return (
        <div className="fixed inset-0 bg-[#020205] text-white font-mono flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-black overflow-hidden">
            
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) translateY(0)',
                animation: 'grid-flow 20s linear infinite'
            }}></div>

            <div className="z-10 w-full max-w-4xl p-4 flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-bold text-cyan-500 mb-2 tracking-widest text-center" style={{ textShadow: '0 0 15px rgba(0,255,255,0.5)' }}>
                    QUANTUM KERNEL
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mb-12 tracking-[0.2em]">SELECT BOOT PARTITION</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    
                    {/* OPTION 1: STABLE */}
                    <button
                        onClick={() => onSelect('legacy')}
                        onMouseEnter={() => setHovered('legacy')}
                        onMouseLeave={() => setHovered(null)}
                        className={`group relative p-6 border-2 rounded-lg text-left transition-all duration-300 flex flex-col h-64 justify-between
                            ${hovered === 'legacy' 
                                ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_30px_rgba(34,211,238,0.2)] scale-105' 
                                : 'border-gray-700 bg-gray-900/40 opacity-80 hover:opacity-100'
                            }
                        `}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${hovered === 'legacy' ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                    STABLE BUILD
                                </span>
                                <span className="text-2xl">💾</span>
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${hovered === 'legacy' ? 'text-white' : 'text-gray-300'}`}>
                                Quantum Core V1
                            </h2>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                La version complète et stable du jeu. Progression sauvegardée, toutes fonctionnalités actives.
                            </p>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-4">
                            > MOUNT /dev/sda1<br/>
                            > EXECUTE legacy_engine.js
                        </div>
                    </button>

                    {/* OPTION 2: EXPERIMENTAL */}
                    <button
                        onClick={() => onSelect('v2')}
                        onMouseEnter={() => setHovered('v2')}
                        onMouseLeave={() => setHovered(null)}
                        className={`group relative p-6 border-2 rounded-lg text-left transition-all duration-300 flex flex-col h-64 justify-between border-dashed
                            ${hovered === 'v2' 
                                ? 'border-pink-500 bg-pink-900/20 shadow-[0_0_30px_rgba(236,72,153,0.2)] scale-105' 
                                : 'border-gray-700 bg-gray-900/40 opacity-60 hover:opacity-100'
                            }
                        `}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${hovered === 'v2' ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                    EXPERIMENTAL
                                </span>
                                <span className="text-2xl">🚧</span>
                            </div>
                            <h2 className={`text-2xl font-bold mb-2 ${hovered === 'v2' ? 'text-pink-300' : 'text-gray-300'}`}>
                                Refactor V2
                            </h2>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Environnement de test pour la nouvelle architecture SRP Atomique. Fonctionnalités incomplètes.
                            </p>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-4">
                            > MOUNT /dev/sdb1 (READ-WRITE)<br/>
                            > INIT atomic_core.ts
                        </div>
                    </button>

                </div>

                <div className="mt-12 text-[10px] text-gray-600 font-mono">
                    SYSTEM_ID: GEMINI-PROTO-05 // MEM: OK // CPU: OK
                </div>
            </div>
        </div>
    );
};

export default Launcher;