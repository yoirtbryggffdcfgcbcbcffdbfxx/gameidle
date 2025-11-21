
import React from 'react';

interface PlanetDisplayProps {
    show: boolean;
    isShaking: boolean;
}

const PlanetDisplay: React.FC<PlanetDisplayProps> = ({ show, isShaking }) => {
    return (
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
            {/* Couche Atmosphère (Lueur Rouge/Orange lors de la rentrée) */}
            <div className={`absolute inset-0 z-10 mix-blend-overlay ${isShaking ? 'animate-atmosphere' : 'opacity-0'}`}></div>

            {/* La Planète */}
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
                <div 
                    className={`
                        w-[180vw] h-[180vw] rounded-full 
                        bg-gradient-to-b from-[#1a0b2e] via-[#312e81] to-[#000] 
                        shadow-[0_-20px_150px_rgba(79,70,229,0.4)] 
                        transform translate-y-[85%]
                        ${show ? 'animate-planet-rise' : ''}
                    `}
                >
                    {/* Grille holographique sur la planète */}
                    <div className="absolute inset-0 opacity-20" style={{
                         backgroundImage: `
                            linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, .3) 25%, rgba(6, 182, 212, .3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .3) 75%, rgba(6, 182, 212, .3) 76%, transparent 77%, transparent), 
                            linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, .3) 25%, rgba(6, 182, 212, .3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, .3) 75%, rgba(6, 182, 212, .3) 76%, transparent 77%, transparent)
                         `,
                         backgroundSize: '60px 60px',
                         maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, transparent 70%)',
                         transform: 'perspective(1000px) rotateX(40deg) scale(2)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default PlanetDisplay;
