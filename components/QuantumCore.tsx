import React, { useState, useEffect } from 'react';
import { CORE_DISCHARGE_DURATION } from '../constants';

interface QuantumCoreProps {
    charge: number;
    isDischarging: boolean;
    onDischarge: () => void;
    multiplier: number;
    size?: number;
}

const QuantumCore: React.FC<QuantumCoreProps> = ({ charge, isDischarging, onDischarge, multiplier, size = 128 }) => {
    const [countdown, setCountdown] = useState(CORE_DISCHARGE_DURATION / 1000);

    const radius = (size / 2) * 0.9;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = size / 16;

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
    const strokeDashoffset = circumference - (circumference * charge) / 100;

    // Dynamic font sizes based on component size
    const styles = {
        dischargingMultiplier: { fontSize: `${size / 4.5}px` },
        dischargingCountdown: { fontSize: `${size / 6}px` },
        chargingLabel: { fontSize: `${size / 11}px` },
        chargingPercentage: { fontSize: `${size / 4.5}px` },
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={onDischarge}
                disabled={!isReady || isDischarging}
                className={`relative rounded-full flex flex-col justify-center items-center transition-all duration-300 transform
                    ${isReady && !isDischarging ? 'animate-pulse-effect cursor-pointer bg-cyan-500/20' : ''}
                    ${isDischarging ? 'bg-purple-500/30' : ''}
                    ${!isReady && !isDischarging ? 'bg-black/20 cursor-not-allowed' : ''}
                `}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    boxShadow: isReady && !isDischarging ? `0 0 15px ${coreColor}` : (isDischarging ? `0 0 20px ${coreColor}`: 'none'),
                }}
            >
                <svg className="absolute w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        cx={size/2} cy={size/2} r={radius}
                        fill="none"
                        stroke={isReady ? coreColor : '#555'}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transform -rotate-90 origin-center transition-all duration-200"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="z-10 text-center">
                    {isDischarging ? (
                        <>
                            <div className="font-bold leading-tight" style={{ ...styles.dischargingMultiplier, color: coreColor }}>x{multiplier.toFixed(1)}</div>
                            <div className="font-bold" style={styles.dischargingCountdown}>{countdown}s</div>
                        </>
                    ) : (
                         <>
                            <div className="leading-tight opacity-80" style={styles.chargingLabel}>Boost x{multiplier.toFixed(1)}</div>
                            <div className="font-bold" style={{ ...styles.chargingPercentage, color: coreColor }}>{Math.floor(charge)}%</div>
                         </>
                    )}
                </div>
            </button>
        </div>
    );
};

export default QuantumCore;
