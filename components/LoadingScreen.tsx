
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const bootLogs = [
    "INITIALIZING KERNEL...",
    "LOADING QUANTUM DRIVERS...",
    "MOUNTING VIRTUAL FILE SYSTEM...",
    "CALIBRATING ENERGY SENSORS...",
    "ESTABLISHING UPLINK...",
    "CHECKING INTEGRITY...",
    "SYSTEM CHECK: OK",
    "ACCESS GRANTED."
];

const LoadingScreen: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let currentLogIndex = 0;
        
        const logInterval = setInterval(() => {
            if (currentLogIndex < bootLogs.length) {
                setLogs(prev => [...prev, bootLogs[currentLogIndex]]);
                currentLogIndex++;
            }
        }, 150); // Vitesse d'apparition des logs

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2; // Vitesse de la barre
            });
        }, 30);

        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-[#050510] flex flex-col items-center justify-center z-[100] font-mono overflow-hidden">
            
            {/* Effet Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[20px] w-full z-10" style={{animation: 'scan-line 3s linear infinite'}}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80 z-0"></div>

            {/* Logo Central */}
            <div className="scale-75 mb-8 relative z-20 animate-pulse">
                <Logo />
            </div>

            {/* Terminal Output */}
            <div className="w-80 h-32 bg-black/50 border border-cyan-900/50 rounded p-4 mb-6 overflow-hidden flex flex-col justify-end relative z-20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                {logs.map((log, index) => (
                    <div key={index} className="text-[10px] text-cyan-500/80 truncate font-mono">
                        <span className="text-cyan-700 mr-2">{`>`}</span>
                        {log}
                    </div>
                ))}
            </div>
            
            {/* Barre de progression */}
            <div className="w-64 h-1 bg-gray-900 rounded overflow-hidden relative z-20">
                <div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#00ffff] transition-all duration-100 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="mt-2 text-[10px] text-cyan-700 font-mono animate-pulse">
                LOADING RESOURCES... {progress}%
            </div>
        </div>
    );
};

export default LoadingScreen;
