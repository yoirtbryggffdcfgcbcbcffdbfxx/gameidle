
import React, { useRef, useState } from 'react';
import Logo from '../Logo';

interface Menu3DContainerProps {
    children: React.ReactNode;
    onCreditsClick: () => void;
    playSfx: (sound: 'ui_hover' | 'click') => void;
    apiUrl?: string;
}

const Menu3DContainer: React.FC<Menu3DContainerProps> = ({ children, onCreditsClick, playSfx, apiUrl }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        setTilt({ x: -y, y: x });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div 
            className="fixed inset-0 bg-[#050510] flex flex-col justify-center items-center z-[90] overflow-hidden perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* --- BACKGROUND: RETRO GRID --- */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div 
                    className="absolute inset-x-0 top-[-50%] h-[100%] origin-bottom"
                    style={{
                        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)`,
                        backgroundSize: '60px 60px',
                        animation: 'grid-flow 4s linear infinite reverse',
                        maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 60%)'
                    }}
                ></div>
                <div 
                    className="absolute inset-x-0 bottom-[-50%] h-[100%] origin-top"
                    style={{
                        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(168, 85, 247, .3) 25%, rgba(168, 85, 247, .3) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, .3) 75%, rgba(168, 85, 247, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(168, 85, 247, .3) 25%, rgba(168, 85, 247, .3) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, .3) 75%, rgba(168, 85, 247, .3) 76%, transparent 77%, transparent)`,
                        backgroundSize: '60px 60px',
                        animation: 'grid-flow 4s linear infinite',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, transparent 60%)'
                    }}
                ></div>
            </div>

            {/* --- FLOATING PARTICLES --- */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white rounded-full animate-particle-fade"
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3}px`,
                            height: `${Math.random() * 3}px`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * -10}s`,
                            opacity: Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <button 
                onClick={onCreditsClick}
                onMouseEnter={() => playSfx('ui_hover')}
                className="absolute top-6 right-6 text-[10px] font-mono text-cyan-500/50 hover:text-cyan-300 transition-colors border border-cyan-500/20 px-3 py-1 rounded hover:bg-cyan-500/10 z-50"
            >
                // CRÉDITS
            </button>

            {/* --- 3D CARD CONTAINER --- */}
            <div 
                ref={containerRef}
                className="relative z-10 flex flex-col items-center p-8 md:p-12 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl transition-transform duration-100 ease-out w-full max-w-md min-h-[480px]"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.5), ${-tilt.y * 2}px ${tilt.x * 2}px 20px rgba(0, 255, 255, 0.1)`
                }}
            >
                {/* Decorative Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500 opacity-50 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500 opacity-50 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-purple-500 opacity-50 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-purple-500 opacity-50 rounded-br-lg"></div>

                <div className="scale-75 md:scale-90 mb-4 md:mb-8 filter drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <Logo isAnimated={true} />
                </div>
               
               {/* Content Slot */}
               <div className="w-full flex-grow flex flex-col">
                   {children}
               </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <span className={`w-1.5 h-1.5 rounded-full ${apiUrl ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    SERVER: {apiUrl ? 'ONLINE' : 'DISCONNECTED'}
                </div>
            </div>
            
            <p className="absolute bottom-4 text-[10px] text-white/20 font-mono z-10">
                QUANTUM CORE OS v2.2.0 // BUILD 2025
            </p>
        </div>
    );
};

export default Menu3DContainer;
