import React from 'react';

export const Atmosphere: React.FC = React.memo(() => {
    return (
        <>
            {/* 3D Perspective Background */}
            <div className="perspective-grid opacity-40 pointer-events-none absolute bottom-[-30%] left-[-50%] w-[200%] h-[120%] z-0"></div>
            
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/10 blur-[100px] pointer-events-none z-0"></div>
            
            {/* Additional Particles or Dust could go here */}
        </>
    );
});