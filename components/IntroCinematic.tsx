
import React, { useState, useEffect, useRef } from 'react';
import SingularityDisplay from './intro/SingularityDisplay';
import { sfx } from '../audio/sfx';

interface IntroCinematicProps {
    onComplete: () => void;
}

const IntroCinematic: React.FC<IntroCinematicProps> = ({ onComplete }) => {
    const [hasStarted, setHasStarted] = useState(false);
    // Timeline Phases:
    // 0: Silence (Black screen, tiny dot)
    // 1: Awakening (Pulse starts, ripples)
    // 2: Instability (Fast pulse, shake, logs)
    // 3: Implosion (Shrink)
    // 4: Big Bang (White Flash)
    const [phase, setPhase] = useState(0);
    const timersRef = useRef<number[]>([]);

    // Nettoyage des timers si le composant est démonté
    useEffect(() => {
        return () => timersRef.current.forEach(clearTimeout);
    }, []);

    const startCinematic = () => {
        // Astuce: Jouer un son silencieux ou très court ici débloque l'AudioContext pour tout le reste du jeu
        const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAJAgEAAg==");
        silent.play().catch(() => {});
        
        if (sfx.buy) {
             // On précharge ou joue un son pour tester
             sfx.buy.volume = 0.1; 
        }

        setHasStarted(true);

        const timeline = [
            { time: 1000, action: () => setPhase(1) }, // Start Pulse
            { time: 5000, action: () => setPhase(2) }, // Instability & Logs
            { time: 9000, action: () => setPhase(3) }, // Implosion
            { time: 9800, action: () => setPhase(4) }, // Big Bang Flash
            { time: 11500, action: onComplete },       // End
        ];

        timeline.forEach(item => {
            const id = window.setTimeout(item.action, item.time);
            timersRef.current.push(id);
        });
    };

    if (!hasStarted) {
        return (
            <div className="fixed inset-0 bg-[#050510] z-[5000] flex flex-col items-center justify-center font-mono">
                {/* Effet Scanline léger */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[5px] w-full" style={{animation: 'scan-line 4s linear infinite'}}></div>
                
                <div className="text-cyan-500 text-xs mb-6 animate-pulse tracking-widest">SYSTEM READY // WAITING INPUT</div>
                
                <button
                    onClick={startCinematic}
                    className="px-8 py-4 border border-cyan-500 text-cyan-400 bg-black/50 hover:bg-cyan-500/20 hover:text-white transition-all duration-300 rounded-sm uppercase tracking-[0.2em] text-sm group relative overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                >
                    <span className="relative z-10">Initialiser le Lien Quantique</span>
                    {/* Scanline interne au bouton */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transform skew-x-[-20deg] transition-all duration-1000 group-hover:left-[100%]"></div>
                </button>
                
                <div className="mt-8 text-[9px] text-cyan-800/60 font-mono">
                    SECURE CONNECTION ESTABLISHED
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-[5000] overflow-hidden flex items-center justify-center cursor-none">
            
            {/* The Singularity Visuals */}
            {phase < 4 && (
                <SingularityDisplay phase={phase} />
            )}

            {/* The Big Bang Flash Overlay */}
            {phase === 4 && (
                <div className="absolute inset-0 bg-white animate-[big-bang-flash_2s_ease-out_forwards] z-50"></div>
            )}

            {/* Skip Button (Hidden during Big Bang) */}
            {phase < 4 && (
                <button
                    onClick={onComplete}
                    className="absolute bottom-8 right-8 z-50 text-[10px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest border border-white/5 px-4 py-2 rounded hover:bg-white/5 font-mono"
                >
                    [ABORT_SEQUENCE]
                </button>
            )}
        </div>
    );
};

export default IntroCinematic;
