
import React from 'react';

interface LogoProps {
    isAnimated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isAnimated = false }) => {
    return (
        <div className="relative flex flex-col items-center justify-center py-2 select-none pointer-events-none">
            {/* Tech Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-40 h-10 bg-cyan-900/20 blur-xl rounded-full"></div>
            </div>

            {/* Main Title */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500 tracking-tighter italic transform -skew-x-6" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.3))' }}>
                        Q-CORE
                    </h1>
                    {/* Glitch Layer */}
                    <h1 className="absolute top-0 left-0 text-4xl md:text-5xl font-black text-cyan-600 opacity-50 animate-[glitch-skew_2s_infinite] mix-blend-overlay transform -skew-x-6" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 40%)' }}>
                        Q-CORE
                    </h1>
                </div>

                {/* Subtitle / Lore Name */}
                <div className="flex items-center gap-3 mt-[-2px]">
                    <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-cyan-600"></div>
                    <span className="text-[9px] md:text-[10px] font-mono text-cyan-400 tracking-[0.4em] uppercase shadow-black drop-shadow-md">GENESIS</span>
                    <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-cyan-600"></div>
                </div>
            </div>
        </div>
    );
};

export default Logo;
