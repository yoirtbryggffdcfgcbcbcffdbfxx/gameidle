import React from 'react';

// FIX: Added style prop to allow for dynamic styling, such as animation duration.
const QuantumFragmentIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <defs>
      <linearGradient id="fragGrad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#D6BCFA" />
        <stop offset="100%" stopColor="#805AD5" />
      </linearGradient>
      <filter id="fragGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#fragGlow)">
      {/* Main Shape */}
      <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" fill="url(#fragGrad)" />
      {/* Inner Facets */}
      <path d="M12 2L12 22" stroke="white" strokeWidth="0.5" strokeOpacity="0.5"/>
      <path d="M2 8.5L22 8.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
      <path d="M2 15.5L22 15.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
      <path d="M7 5.25L17 5.25" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
      <path d="M7 18.75L17 18.75" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
      {/* Center point */}
      <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.8"/>
    </g>
  </svg>
);

export default QuantumFragmentIcon;