
import React, { useEffect, useState } from 'react';
import { sfx } from '../../audio/sfx';

const bootLogs = [
    "INITIALIZING KERNEL...",
    "LOADING QUANTUM DRIVERS...",
    "MOUNTING VIRTUAL FILE SYSTEM...",
    "CALIBRATING ENERGY SENSORS...",
    "ESTABLISHING UPLINK...",
    "SYSTEM CHECK: OK",
    "ACCESS GRANTED."
];

const SystemBoot: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        let delay = 0;
        bootLogs.forEach((log, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setLogs(prev => [...prev, log]);
                if (sfx.typing) {
                    sfx.typing.currentTime = 0;
                    sfx.typing.volume = 0.2;
                    sfx.typing.play().catch(() => {});
                }
            }, delay);
        });
    }, []);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/30 backdrop-blur-md z-20 animate-fade-in-fast font-mono">
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[4px] w-full" style={{animation: 'scan-line 3s linear infinite'}}></div>

            <div className="w-full max-w-lg p-8 border-y-2 border-cyan-500/30 bg-black/60 relative">
                {/* Decorative Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500"></div>

                <h1 className="text-3xl md:text-5xl font-bold text-cyan-400 text-center mb-8 tracking-widest animate-pulse" style={{textShadow: '0 0 10px rgba(34, 211, 238, 0.8)'}}>
                    QUANTUM OS
                </h1>

                <div className="h-32 overflow-hidden flex flex-col justify-end mb-6 font-mono text-xs md:text-sm text-cyan-300/80">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 animate-toast-in">
                            <span className="text-cyan-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {log}
                        </div>
                    ))}
                </div>

                <div className="w-full h-1 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-cyan-400 animate-progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default SystemBoot;
