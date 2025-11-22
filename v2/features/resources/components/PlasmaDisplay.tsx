import React, { useRef, useEffect } from 'react';
import { useGameSelector } from '../../../lib/context';
import { formatNumber } from '../../../lib/selectors';

export const PlasmaDisplay: React.FC = React.memo(() => {
    const energy = useGameSelector(state => state.resources.energy);
    const lastFlash = useGameSelector(state => state.ui.lastPlasmaFlash);

    // V2 Mockup Target (à connecter plus tard au système de progression)
    const target = 10000;
    const percentage = Math.min((energy / target) * 100, 100);
    const barText = `${formatNumber(energy)} / ${formatNumber(target)}`;
    const glowColor = '#00ffcc';

    const containerRef = useRef<HTMLDivElement>(null);
    const prevFlashRef = useRef(lastFlash);

    // Effet de flash lors du CLIC MANUEL uniquement
    useEffect(() => {
        if (lastFlash > prevFlashRef.current) {
            const el = containerRef.current;
            if (el) {
                el.classList.remove('animate-plasma-flash');
                void el.offsetWidth;
                el.classList.add('animate-plasma-flash');
            }
        }
        prevFlashRef.current = lastFlash;
    }, [lastFlash]);

    return (
        <div className="w-full max-w-md mx-auto mb-4 md:mb-8">
            <div className="flex justify-between items-end mb-1 px-1">
                <span className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest">Condensateur</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Objectif: <span className="text-cyan-400">Upgrade</span></span>
            </div>

            <div
                ref={containerRef}
                className="plasma-bar-container" // Réutilisation classe CSS V1
            >
                {/* Background Ticks */}
                <div className="plasma-bar-ticks"></div>

                {/* The Plasma Fluid */}
                <div
                    className="plasma-fill"
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${glowColor}20, ${glowColor})`,
                        color: glowColor
                    }}
                ></div>

                {/* Centered Capacity Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="relative px-4 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 shadow-lg">
                        <span className="text-sm md:text-xl font-bold font-mono text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] tracking-wider">
                            {barText}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});