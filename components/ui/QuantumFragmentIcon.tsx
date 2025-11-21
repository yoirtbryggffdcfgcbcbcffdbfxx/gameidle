
import React from 'react';

const QuantumFragmentIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <defs>
      <linearGradient id="tesseractGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d8b4fe" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <filter id="glow-tesseract" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g filter="url(#glow-tesseract)">
      {/* Outer Cube Rotation */}
      <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '20s' }}>
         <path 
            d="M20 20 L80 20 L80 80 L20 80 Z" 
            fill="none" 
            stroke="url(#tesseractGradient)" 
            strokeWidth="2" 
            opacity="0.8"
         />
      </g>

      {/* Inner Cube Rotation (Counter) */}
      <g className="animate-spin-reverse-slow" style={{ transformOrigin: '50px 50px', animationDuration: '15s' }}>
         <path 
            d="M35 35 L65 35 L65 65 L35 65 Z" 
            fill="rgba(168, 85, 247, 0.2)" 
            stroke="#e9d5ff" 
            strokeWidth="1.5"
         />
      </g>

      {/* Connecting Lines (Dynamic) */}
      <g className="animate-pulse" style={{ animationDuration: '3s' }}>
        <line x1="20" y1="20" x2="35" y2="35" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <line x1="80" y1="20" x2="65" y2="35" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <line x1="80" y1="80" x2="65" y2="65" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="80" x2="35" y2="65" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Unstable Energy Orbits */}
      <ellipse cx="50" cy="50" rx="45" ry="10" stroke="#c084fc" strokeWidth="0.5" fill="none" className="animate-spin-clockwise-1" style={{ transformOrigin: '50px 50px', opacity: 0.6 }} />
      <ellipse cx="50" cy="50" rx="45" ry="10" stroke="#c084fc" strokeWidth="0.5" fill="none" className="animate-spin-clockwise-2" style={{ transformOrigin: '50px 50px', opacity: 0.6, animationDelay: '-5s' }} />
    </g>
  </svg>
);

export default QuantumFragmentIcon;
