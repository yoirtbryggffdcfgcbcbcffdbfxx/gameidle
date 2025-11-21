
import React, { useEffect, useRef } from 'react';
import { useEnergyBarLogic } from '../../hooks/ui/useEnergyBarLogic';
import { useGameContext } from '../../contexts/GameContext';

const EnergyBar: React.FC = () => {
    const { config, percentage, barText } = useEnergyBarLogic();
    const { gameState } = useGameContext();
    const GoalIcon = config.Icon;
    
    // Ref pour le conteneur afin de manipuler les classes directement
    const containerRef = useRef<HTMLDivElement>(null);
    const prevClicksRef = useRef(gameState.totalClicks);

    // Animation déclenchée à chaque changement de totalClicks
    useEffect(() => {
        if (gameState.totalClicks > prevClicksRef.current) {
            const el = containerRef.current;
            if (el) {
                // Technique de "Force Reflow" pour redémarrer une animation CSS instantanément
                el.classList.remove('animate-plasma-flash');
                void el.offsetWidth; // Lecture de propriété qui force le navigateur à recalculer le layout
                el.classList.add('animate-plasma-flash');
            }
        }
        prevClicksRef.current = gameState.totalClicks;
    }, [gameState.totalClicks]);

    // Dynamic shadow color based on the gradient start color approximation
    const glowColor = config.isLogarithmic ? '#ff00cc' : '#00ffcc';

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1 px-1">
                <span className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest">Condensateur</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Objectif: <span className="text-cyan-400">{config.label}</span></span>
            </div>
            
            <div 
                id="energy-bar-container" 
                ref={containerRef}
                className="plasma-bar-container"
            >
                {/* Background Ticks */}
                <div className="plasma-bar-ticks"></div>
                
                {/* The Plasma Fluid */}
                <div 
                    id="energyBar" 
                    className="plasma-fill" 
                    style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${glowColor}20, ${glowColor})`,
                        color: glowColor // For box-shadow inheritance
                    }}
                ></div>
                
                {/* Centered Capacity Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="relative px-4 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 shadow-lg">
                        <span className="text-base md:text-xl font-bold font-mono text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] tracking-wider">
                            {barText}
                        </span>
                    </div>
                </div>

                {/* Goal Marker (floating inside at right) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-80">
                     <div className={`text-white drop-shadow-[0_0_5px_rgba(0,0,0,1)] ${config.isLogarithmic ? 'animate-spin-slow' : ''}`}>
                        <GoalIcon className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyBar;
