
import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../../audio/sfx';

interface ShopIntroCinematicProps {
    onComplete: () => void;
}

const ShopIntroCinematic: React.FC<ShopIntroCinematicProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);
    // Phase 0: Scanning / Noise
    // Phase 1: Locking Signal / Cyan
    // Phase 2: Downloading Data
    // Phase 3: Complete / Flash

    // Utilisation d'une ref pour garantir l'accès à la dernière version de la fonction
    // sans déclencher le useEffect si la prop change (ce qui arrive à chaque tick du jeu)
    const onCompleteRef = useRef(onComplete);
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        // Play initial static/scan sound if available, or reuse typing sound
        if (sfx.typing) {
             sfx.typing.currentTime = 0;
             sfx.typing.volume = 0.2;
             sfx.typing.play().catch(() => {});
        }

        const timeline = [
            { time: 2000, action: () => setPhase(1) }, // Signal Found
            { time: 3500, action: () => setPhase(2) }, // Downloading
            { time: 5500, action: () => {
                setPhase(3);
                if (sfx.buy) { // Confirmation sound
                    sfx.buy.currentTime = 0;
                    sfx.buy.play().catch(() => {});
                }
            }}, 
            { time: 6500, action: () => onCompleteRef.current() } // End
        ];

        const timers = timeline.map(step => setTimeout(step.action, step.time));
        return () => timers.forEach(clearTimeout);
    }, []); // Dépendance vide : La cinématique ne se lance qu'une seule fois au montage

    return (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono overflow-hidden">
            {/* Background Scan Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                 backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)',
                 backgroundSize: '30px 30px',
                 animation: 'scan-line 3s linear infinite'
            }}></div>

            {/* Central HUD Element */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                
                {/* Radar Ring */}
                <div className={`absolute inset-0 rounded-full border-2 ${phase >= 1 ? 'border-cyan-500 shadow-[0_0_30px_#00ffff]' : 'border-red-900 opacity-50'} transition-all duration-500`}></div>
                
                {/* Rotating Scanner */}
                {phase < 2 && (
                     <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-radar-spin opacity-50"></div>
                )}

                {/* Locking Brackets (Phase 1+) */}
                {phase >= 1 && (
                    <>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 animate-bracket-lock"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 animate-bracket-lock"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 animate-bracket-lock"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 animate-bracket-lock"></div>
                    </>
                )}

                {/* Center Content */}
                <div className="text-center z-10">
                    {phase === 0 && <div className="text-red-500 text-xs animate-pulse">SCANNING...</div>}
                    {phase === 1 && <div className="text-cyan-400 text-sm font-bold animate-pulse">SIGNAL LOCKED</div>}
                    {phase === 2 && <div className="text-yellow-400 text-sm font-bold">DOWNLOADING...</div>}
                    {phase === 3 && <div className="text-white text-lg font-bold">ACCESS GRANTED</div>}
                </div>
            </div>

            {/* Data Stream Side Panels */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-40 overflow-hidden opacity-50 hidden md:block">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="text-[8px] text-green-500 animate-uplink-stream" style={{animationDelay: `${Math.random()}s`}}>
                        {Math.random().toString(16).substr(2, 8).toUpperCase()}
                    </div>
                ))}
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-40 overflow-hidden opacity-50 text-right hidden md:block">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="text-[8px] text-green-500 animate-uplink-stream" style={{animationDelay: `${Math.random()}s`}}>
                        {Math.random().toString(16).substr(2, 8).toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Progress Bar (Phase 2) */}
            {phase === 2 && (
                <div className="absolute bottom-20 w-64 h-2 bg-gray-800 rounded overflow-hidden border border-gray-600">
                    <div className="h-full bg-yellow-400 animate-progress-fill" style={{animationDuration: '2s'}}></div>
                </div>
            )}

            {/* Flash Overlay (Phase 3) */}
            {phase === 3 && <div className="absolute inset-0 bg-white animate-success-flash pointer-events-none"></div>}
        </div>
    );
};

export default ShopIntroCinematic;
