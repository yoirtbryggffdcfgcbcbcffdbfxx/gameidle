
import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../../../audio/sfx';
import AuthScanner from './AuthScanner';

interface ShopGatewayProps {
    onComplete: () => void;
}

const ShopGateway: React.FC<ShopGatewayProps> = ({ onComplete }) => {
    // Phase 0: Init / Locked (Red/Neutral)
    // Phase 1: Scanning (Blue/Cyan)
    // Phase 2: Success / Construct (GOLD/YELLOW transition)
    // Phase 3: Exit
    const [phase, setPhase] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    
    const onCompleteRef = useRef(onComplete);

    const addLog = (text: string) => {
        setLogs(prev => [...prev.slice(-3), text]); 
    };

    useEffect(() => {
        let timeoutIds: number[] = [];

        const playSound = (type: 'typing' | 'buy' | 'click') => {
            if (sfx[type]) {
                sfx[type].currentTime = 0;
                sfx[type].volume = type === 'buy' ? 0.4 : 0.2;
                sfx[type].play().catch(() => {});
            }
        };
        
        playSound('typing');

        // T=0: Start
        addLog("INITIALISATION DU PROTOCOLE...");

        // T=1000: Start Scan (BLUE Phase)
        timeoutIds.push(window.setTimeout(() => {
            setPhase(1);
            addLog("RECHERCHE DE SIGNATURE...");
            playSound('typing');
        }, 1000));

        // T=2500: Identification
        timeoutIds.push(window.setTimeout(() => {
            addLog("SIGNATURE QUANTIQUE DÉTECTÉE.");
            playSound('typing');
        }, 2500));

        // T=3500: Success (GOLD Phase trigger)
        timeoutIds.push(window.setTimeout(() => {
            setPhase(2);
            addLog("ACCÈS PREMIUM AUTORISÉ."); // Changed text slightly
            playSound('buy'); 
        }, 3500));

        // T=4500: Welcome Message
        timeoutIds.push(window.setTimeout(() => {
            addLog("BIENVENUE AU NEXUS.");
        }, 4500));

        // T=6000: Complete
        timeoutIds.push(window.setTimeout(() => {
            setPhase(3);
            setTimeout(() => {
                onCompleteRef.current();
            }, 500);
        }, 6000));

        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, []);

    // Détermination des couleurs dynamiques selon la phase
    // Phase < 2 : Cyan (Sécurité/Système)
    // Phase >= 2 : Or/Jaune (Boutique/Premium)
    const isSuccess = phase >= 2;
    const themeColor = isSuccess ? 'text-yellow-400' : 'text-cyan-500';
    const borderColor = isSuccess ? 'border-yellow-500/50' : 'border-cyan-900/50';
    const barColor = isSuccess ? 'bg-yellow-400' : 'bg-cyan-400';
    const glowColor = isSuccess ? 'rgba(234, 179, 8, 0.3)' : 'rgba(0, 255, 255, 0.3)';

    return (
        <div className={`fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center overflow-hidden font-mono ${themeColor} select-none cursor-none transition-colors duration-500`}>
            
            {/* Background Grid Animation (Phase 2+ turns GOLD) */}
            {phase >= 2 && (
                <div className="absolute inset-0 pointer-events-none animate-grid-deploy opacity-30" style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, ${glowColor} 25%, ${glowColor} 26%, transparent 27%, transparent 74%, ${glowColor} 75%, ${glowColor} 76%, transparent 77%, transparent), 
                                      linear-gradient(90deg, transparent 24%, ${glowColor} 25%, ${glowColor} 26%, transparent 27%, transparent 74%, ${glowColor} 75%, ${glowColor} 76%, transparent 77%, transparent)`,
                    backgroundSize: '50px 50px',
                    transformOrigin: 'center bottom'
                }}></div>
            )}

            {/* Flash Overlay on Success (GOLD) */}
            {phase === 2 && <div className="absolute inset-0 pointer-events-none animate-access-flash-gold"></div>}

            {/* Main HUD Container */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                
                {/* Top Status Bar */}
                <div className={`w-64 h-1 bg-gray-900 rounded overflow-hidden border ${borderColor} transition-colors duration-500`}>
                    <div 
                        className={`h-full ${barColor} transition-all duration-[4000ms] ease-linear`}
                        style={{ width: phase === 0 ? '0%' : '100%' }}
                    ></div>
                </div>

                {/* Scanner Component (Handles its own color logic via props) */}
                <AuthScanner status={phase === 0 ? 'locked' : phase === 1 ? 'scanning' : 'success'} />

                {/* Logs Terminal */}
                <div className="h-24 flex flex-col items-center justify-end space-y-1 text-xs md:text-sm font-bold tracking-wider">
                    {logs.map((log, i) => (
                        <div key={i} className="animate-text-decode opacity-80 transition-colors duration-300">
                            {i === logs.length - 1 && <span className={`mr-2 ${isSuccess ? 'text-yellow-200' : 'text-cyan-300'}`}>{'>'}</span>}
                            {log}
                        </div>
                    ))}
                </div>

                {/* Big Welcome Text (Phase 2 - GOLD) */}
                {phase >= 2 && (
                    <div className="absolute top-full mt-8 text-center">
                        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-400 animate-fade-in-fast" style={{ letterSpacing: '0.2em' }}>
                            NEXUS
                        </h1>
                        <p className="text-xs text-yellow-600 mt-2 tracking-[0.5em] animate-pulse">ONLINE</p>
                    </div>
                )}

            </div>

            {/* Decorative Corners (Dynamic Color) */}
            <div className={`absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 rounded-tl-lg transition-colors duration-700 ${isSuccess ? 'border-yellow-600/50' : 'border-cyan-800/50'}`}></div>
            <div className={`absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 rounded-tr-lg transition-colors duration-700 ${isSuccess ? 'border-yellow-600/50' : 'border-cyan-800/50'}`}></div>
            <div className={`absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 rounded-bl-lg transition-colors duration-700 ${isSuccess ? 'border-yellow-600/50' : 'border-cyan-800/50'}`}></div>
            <div className={`absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 rounded-br-lg transition-colors duration-700 ${isSuccess ? 'border-yellow-600/50' : 'border-cyan-800/50'}`}></div>

        </div>
    );
};

export default ShopGateway;
