import React from 'react';

export const GameBackground: React.FC = React.memo(() => (
    <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#000_100%)]"></div>
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
        }}></div>
    </div>
));