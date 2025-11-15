import React from 'react';
import { CORE_DISCHARGE_DURATION } from '../constants';

interface QuantumCoreProps {
    charge: number;
    isDischarging: boolean;
    dischargeEndTimestamp: number | null;
    onInteraction: (event: React.PointerEvent<HTMLButtonElement>) => void;
    multiplier: number;
    size?: number;
    showReadyNotification: boolean;
}

const QuantumCore: React.FC<QuantumCoreProps> = ({ charge, isDischarging, dischargeEndTimestamp, onInteraction, multiplier, size = 128, showReadyNotification }) => {
    const remainingMs = isDischarging && dischargeEndTimestamp ? Math.max(0, dischargeEndTimestamp - Date.now()) : 0;
    const countdown = Math.ceil(remainingMs / 1000);

    const radius = 45; // Fixed radius for a 100x100 viewBox
    const circumference = 2 * Math.PI * radius;
    
    const isReady = charge >= 100;
    const coreColor = isDischarging ? '#ff00c8' : '#00f5d4';
    const strokeDashoffset = circumference - (circumference * charge) / 100;
    
    const titleText = isReady ? "Activer le boost !" : "Améliorer le cœur";
    
    const scaledStyles = {
        dischargingMultiplier: { fontSize: `${size / 4.5}px` },
        dischargingCountdown: { fontSize: `${size / 6}px` },
        chargingLabel: { fontSize: `${size / 11}px` },
        chargingPercentage: { fontSize: `${size / 4.5}px` },
    };

    const coreClasses = [
        'relative rounded-full flex flex-col justify-center items-center transition-all duration-300 transform cursor-pointer group',
        isReady && !isDischarging ? 'core-ready' : ''
    ].join(' ');

    return (
        <div className="flex justify-center items-center">
            <button
                onPointerDown={onInteraction}
                disabled={isDischarging}
                title={titleText}
                className={coreClasses}
                style={{ width: `${size}px`, height: `${size}px` }}
            >
                {showReadyNotification && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-500 rounded-full animate-pulse-purple border-2 border-black z-20" title="Cœur prêt à être activé !"></div>
                )}
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
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
                        <filter id="glow">
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
                    
                    {/* Orbits */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke={coreColor} strokeWidth="0.5" strokeOpacity="0.5" className="animate-spin-clockwise-1" />
                    <circle cx="50" cy="50" r="32" fill="none" stroke={coreColor} strokeWidth="0.75" strokeOpacity="0.6" strokeDasharray="3 5" className="animate-spin-counter-clockwise-1" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke={coreColor} strokeWidth="0.25" strokeOpacity="0.3" className="animate-spin-clockwise-2" />
                    
                    {/* Crackling Energy Arcs */}
                    <path d="M 30 40 Q 35 35, 40 40" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.1s' }}/>
                    <path d="M 60 38 Q 68 45, 62 50" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.3s' }}/>
                    <path d="M 35 60 Q 40 68, 48 62" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.6s' }}/>
                    <path d="M 65 65 Q 60 70, 55 60" stroke={coreColor} strokeWidth="0.5" fill="none" className="energy-arc" style={{ animationDelay: '0.8s' }}/>
                    
                    {/* Central Core */}
                    <circle cx="50" cy="50" r="20" fill="black" />
                    <circle cx="50" cy="50" r="18" fill={coreColor} filter="url(#glow)" className="animate-core-breathe" />

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
                        filter="url(#glow)"
                    />
                </svg>

                 <div className="z-10 text-center text-white" style={{ textShadow: `0 0 5px ${coreColor}, 0 0 10px black` }}>
                    {isDischarging ? (
                        <>
                            <div className="font-bold leading-tight animate-discharge-flash" style={{ ...scaledStyles.dischargingMultiplier, color: coreColor }}>x{multiplier.toFixed(1)}</div>
                            <div className="font-bold" style={scaledStyles.dischargingCountdown}>{countdown}s</div>
                        </>
                    ) : (
                         <>
                            <div className="leading-tight opacity-80" style={scaledStyles.chargingLabel}>{isReady ? 'PRÊT !' : `Boost x${multiplier.toFixed(1)}`}</div>
                            <div className="font-bold" style={{ ...scaledStyles.chargingPercentage, color: coreColor }}>{Math.floor(charge)}%</div>
                         </>
                    )}
                </div>
            </button>
        </div>
    );
};

export default QuantumCore;