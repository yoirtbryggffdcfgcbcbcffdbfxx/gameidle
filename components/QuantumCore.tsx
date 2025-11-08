import React, { useState, useEffect } from 'react';
import { CORE_DISCHARGE_DURATION } from '../constants';

interface QuantumCoreProps {
    charge: number;
    isDischarging: boolean;
    onDischarge: () => void;
    multiplier: number;
}

const QuantumCore: React.FC<QuantumCoreProps> = ({ charge, isDischarging, onDischarge, multiplier }) => {
    const [countdown, setCountdown] = useState(CORE_DISCHARGE_DURATION / 1000);

    useEffect(() => {
        if (isDischarging) {
            setCountdown(CORE_DISCHARGE_DURATION / 1000);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isDischarging]);

    const isReady = charge >= 100;
    const coreColor = isDischarging ? '#ff00c8' : '#00f5d4';
    const strokeDasharray = 2 * Math.PI * 18; // Circumference of the circle (r=18)
    const strokeDashoffset = strokeDasharray - (strokeDasharray * charge) / 100;

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={onDischarge}
                disabled={!isReady || isDischarging}
                className={`relative w-16 h-16 rounded-full flex flex-col justify-center items-center transition-all duration-300 transform
                    ${isReady && !isDischarging ? 'animate-pulse-effect cursor-pointer bg-cyan-500/20' : ''}
                    ${isDischarging ? 'bg-purple-500/30' : ''}
                    ${!isReady && !isDischarging ? 'bg-black/20 cursor-not-allowed' : ''}
                `}
                style={{
                    boxShadow: isReady && !isDischarging ? `0 0 15px ${coreColor}` : (isDischarging ? `0 0 20px ${coreColor}`: 'none'),
                }}
            >
                <svg className="absolute w-full h-full" viewBox="0 0 40 40">
                    <circle
                        cx="20" cy="20" r="18"
                        fill="none"
                        stroke={isReady ? coreColor : '#555'}
                        strokeWidth="2"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transform -rotate-90 origin-center transition-all duration-200"
                    />
                </svg>

                <div className="z-10 text-center">
                    {isDischarging ? (
                        <>
                            <div className="text-lg font-bold leading-tight" style={{ color: coreColor }}>x{multiplier.toFixed(1)}</div>
                            <div className="text-base font-bold">{countdown}s</div>
                        </>
                    ) : (
                         <>
                            <div className="text-[9px] leading-tight opacity-80">Boost x{multiplier.toFixed(1)}</div>
                            <div className="text-base font-bold" style={{ color: coreColor }}>{Math.floor(charge)}%</div>
                         </>
                    )}
                </div>
            </button>
        </div>
    );
};

export default QuantumCore;