
import React from 'react';

interface ReactorVisualProps {
    coreColor: string;
    charge: number;
    isReady: boolean;
    isActive: boolean;
    activeTimeRemaining: number;
}

const hexPoints = "50,10 85,30 85,70 50,90 15,70 15,30";
const radius = 45;
const circumference = 2 * Math.PI * radius;

// Composant de présentation pure (Pure Visual)
export const ReactorVisual: React.FC<ReactorVisualProps> = React.memo(({ 
    coreColor, 
    charge, 
    isReady, 
    isActive, 
    activeTimeRemaining 
}) => {
    const strokeDashoffset = circumference - (circumference * charge) / 100;

    return (
        <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full transition-all duration-300 transform group outline-none ${isReady ? 'cursor-pointer hover:scale-105 core-ready' : 'cursor-default'}`}>
            {/* Notification visuelle si prêt */}
            {isReady && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-pulse-purple border-2 border-black z-20"></div>
            )}

            <svg className="absolute w-full h-full inset-0" viewBox="0 0 100 100">
                <defs>
                        <radialGradient id="backgroundGlowGradient">
                        <stop offset="0%" stopColor={coreColor} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="coreGlowGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={coreColor} stopOpacity="0.8" />
                        <stop offset="70%" stopColor={coreColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowV2">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Background Field */}
                <circle cx="50" cy="50" r="50" fill="url(#backgroundGlowGradient)" />

                {/* Aura */}
                <circle cx="50" cy="50" r="48" fill="url(#coreGlowGradient)" className="animate-core-glow" />
                
                {/* Outer Hexagon - Slow Rotation */}
                <g className="animate-slow-rotate" style={{ transformOrigin: '50px 50px' }}>
                    <polygon points={hexPoints} fill="none" stroke={coreColor} strokeWidth="0.5" strokeOpacity="0.4" />
                </g>
                
                {/* Inner Hexagon - Counter Rotation */}
                <g className="animate-spin-counter-clockwise-1" style={{ transformOrigin: '50px 50px', animationDuration: '20s' }}>
                        <polygon points={hexPoints} fill="none" stroke={coreColor} strokeWidth="0.5" strokeOpacity="0.6" transform="scale(0.8) translate(12.5, 12.5)" strokeDasharray="5 5" />
                </g>
                
                {/* Rotating Brackets/Segments */}
                <g className="animate-spin-clockwise-2" style={{ transformOrigin: '50px 50px' }}>
                        <path d="M 50 15 A 35 35 0 0 1 85 50" fill="none" stroke={coreColor} strokeWidth="1" strokeOpacity="0.3" />
                        <path d="M 50 85 A 35 35 0 0 1 15 50" fill="none" stroke={coreColor} strokeWidth="1" strokeOpacity="0.3" />
                </g>

                {/* Energy Arcs */}
                <path d="M 30 40 Q 35 35, 40 40" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.1s' }}/>
                <path d="M 60 38 Q 68 45, 62 50" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.3s' }}/>
                <path d="M 35 60 Q 40 68, 48 62" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.6s' }}/>
                <path d="M 65 65 Q 60 70, 55 60" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.8s' }}/>
                
                {/* Central Core */}
                <circle cx="50" cy="50" r="20" fill="black" />
                <circle cx="50" cy="50" r="18" fill={coreColor} filter="url(#glowV2)" className="animate-core-breathe" />

                {/* Charge Progress Ring */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    stroke={coreColor}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transform -rotate-90 origin-center transition-all duration-200"
                    strokeLinecap="round"
                    filter="url(#glowV2)"
                />
            </svg>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white pointer-events-none" style={{ textShadow: `0 0 5px ${coreColor}, 0 0 10px black` }}>
                {isActive ? (
                    <>
                        <div className="font-bold text-2xl leading-tight animate-discharge-flash" style={{ color: coreColor }}>x5.0</div>
                        <div className="font-bold text-sm">{(activeTimeRemaining / 1000).toFixed(1)}s</div>
                    </>
                ) : (
                        <>
                        <div className="text-[10px] leading-tight opacity-80 uppercase tracking-wider">{isReady ? 'PRÊT !' : `BOOST x5.0`}</div>
                        <div className="font-bold text-xl" style={{ color: coreColor }}>{Math.floor(charge)}%</div>
                        </>
                )}
            </div>
        </div>
    );
});
