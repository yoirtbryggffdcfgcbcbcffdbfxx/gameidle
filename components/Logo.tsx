import React from 'react';

interface LogoProps {
    isAnimated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isAnimated = false }) => {
    return (
        <div className="relative w-48 h-48">
             <h1 className="absolute -top-8 left-1/2 -translate-x-1/2 mt-0 text-2xl text-[var(--text-header)] [text-shadow:1px_1px_#000]">
                Quantum Core
            </h1>
            <svg viewBox="0 0 200 200" className={`w-full h-full ${isAnimated ? 'animate-slow-rotate' : ''}`}>
                <defs>
                    <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#00ffff" />
                        <stop offset="100%" stopColor="#005f5f" />
                    </radialGradient>
                </defs>

                {/* Orbits with individual animations */}
                <g className={isAnimated ? "animate-spin-clockwise-1" : ""} style={{ transformOrigin: '100px 100px' }}>
                    <ellipse cx="100" cy="100" rx="90" ry="35" stroke="#4f4f7f" strokeWidth="2" fill="none" transform="rotate(45 100 100)" />
                </g>
                <g className={isAnimated ? "animate-spin-counter-clockwise-1" : ""} style={{ transformOrigin: '100px 100px' }}>
                     <ellipse cx="100" cy="100" rx="90" ry="35" stroke="#4f4f7f" strokeWidth="2" fill="none" transform="rotate(-45 100 100)" />
                </g>
                <g className={isAnimated ? "animate-spin-clockwise-2" : ""} style={{ transformOrigin: '100px 100px' }}>
                    <ellipse cx="100" cy="100" rx="90" ry="35" stroke="#4f4f7f" strokeWidth="2" fill="none" transform="rotate(0 100 100)" />
                </g>

                 {/* Central Core - drawn last to be on top */}
                <circle cx="100" cy="100" r="25" fill="url(#coreGradient)" className="animate-core-breathe" style={{transformOrigin: '100px 100px'}} />
            </svg>
        </div>
    );
};

export default Logo;