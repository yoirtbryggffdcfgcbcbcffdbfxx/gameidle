
import React, { useEffect, useState, useMemo } from 'react';

interface SingularityDisplayProps {
    phase: number; // 0: Calm, 1: Pulse, 2: Unstable, 3: Implode
}

const LOG_MESSAGES = [
    "AVERTISSEMENT : DENSITÉ CRITIQUE",
    "ERREUR : CONFINEMENT MAGNÉTIQUE HS",
    "DÉTECTION D'ANOMALIE TEMPORELLE",
    "EFFONDREMENT GRAVITATIONNEL IMMINENT",
    "CALCUL DE LA CONSTANTE DE PLANCK...",
    "ÉCHEC DU SYSTÈME DE REFROIDISSEMENT",
    "L'UNIVERS N'EST PAS PRÊT",
    "INITIALISATION DU PROTOCOLE ZÉRO"
];

const SingularityDisplay: React.FC<SingularityDisplayProps> = ({ phase }) => {
    const [ripples, setRipples] = useState<{ id: number }[]>([]);
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

    // Générateur d'ondes de choc synchronisé avec le "battement"
    useEffect(() => {
        if (phase < 1 || phase >= 3) return;

        const intervalTime = phase === 2 ? 250 : 1500; // Plus rapide en phase instable
        
        const interval = setInterval(() => {
            const id = Date.now();
            setRipples(prev => [...prev, { id }]);
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== id));
            }, 2000);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [phase]);

    // Générateur de logs en phase 2
    useEffect(() => {
        if (phase !== 2) return;
        
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < LOG_MESSAGES.length) {
                const msg = LOG_MESSAGES[logIndex];
                setVisibleLogs(prev => [msg, ...prev].slice(0, 5));
                logIndex++;
            }
        }, 400);

        return () => clearInterval(logInterval);
    }, [phase]);

    // Particules d'accrétion (statiques générées une fois, animées par CSS)
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            angle: Math.random() * 360,
            delay: Math.random() * 2,
            dist: 100 + Math.random() * 100
        }));
    }, []);

    const containerClass = phase === 2 ? 'animate-[unstable-shake_0.1s_infinite]' : '';
    
    // Gestion de la taille/couleur du centre selon la phase
    let centerClass = 'w-2 h-2 bg-white opacity-50'; // Phase 0
    if (phase === 1) centerClass = 'w-4 h-4 bg-white shadow-[0_0_30px_white] animate-[singularity-pulse_4s_ease-in-out_infinite]';
    if (phase === 2) centerClass = 'w-8 h-8 bg-black border-2 border-white shadow-[0_0_80px_#00ffff] animate-[singularity-pulse_0.2s_ease-in-out_infinite]';
    if (phase === 3) centerClass = 'w-8 h-8 bg-black animate-[singularity-implode_0.8s_ease-in_forwards]';

    return (
        <div className={`absolute inset-0 flex items-center justify-center bg-black overflow-hidden ${containerClass}`}>
            
            {/* Accretion Disk Particles (Visible only in Phase 1 & 2) */}
            {(phase === 1 || phase === 2) && particles.map(p => (
                <div
                    key={p.id}
                    className="absolute w-1 h-1 bg-cyan-500 rounded-full opacity-0"
                    style={{
                        transform: `rotate(${p.angle}deg) translateX(${p.dist}px)`,
                        animation: `suck-in ${phase === 2 ? 0.5 : 2}s ease-in infinite`,
                        animationDelay: `${p.delay}s`
                    }}
                />
            ))}

            {/* Ondes de choc */}
            {ripples.map(ripple => (
                <div 
                    key={ripple.id}
                    className={`absolute rounded-full border ${phase === 2 ? 'border-red-500/50' : 'border-white/30'} animate-[singularity-ripple_2s_ease-out_forwards]`}
                    style={{ width: '50px', height: '50px' }}
                ></div>
            ))}

            {/* Logs Système (Phase 2) */}
            {phase === 2 && (
                <div className="absolute top-1/4 left-0 w-full flex flex-col items-center gap-1 pointer-events-none z-20">
                    {visibleLogs.map((log, i) => (
                        <div 
                            key={i} 
                            className={`text-[10px] font-mono font-bold tracking-widest text-red-500 bg-black/50 px-2 ${i===0 ? 'text-red-300 scale-110' : 'opacity-60'}`}
                        >
                            {log}
                        </div>
                    ))}
                </div>
            )}

            {/* La Singularité Centrale */}
            <div className={`relative z-10 rounded-full transition-all duration-500 ${centerClass}`}>
                {/* Halo interne pour phase 2 */}
                {phase === 2 && <div className="absolute inset-0 rounded-full border border-cyan-400 opacity-50 animate-ping"></div>}
            </div>

            {/* Texte de fond */}
            {phase === 2 && (
                <div className="absolute bottom-20 text-red-600/20 font-mono text-4xl font-black animate-pulse select-none whitespace-nowrap">
                    FATAL ERROR // SYSTEM FAILURE //
                </div>
            )}
        </div>
    );
};

export default SingularityDisplay;
