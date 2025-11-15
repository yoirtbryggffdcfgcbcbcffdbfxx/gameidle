import React from 'react';

const Buy10Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="buy10Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FD1C5" />
        <stop offset="100%" stopColor="#319795" />
      </linearGradient>
    </defs>
    {/* Crate Outline */}
    <rect x="3" y="6" width="18" height="12" rx="1" stroke="url(#buy10Grad)" strokeWidth="1.5"/>
    {/* Crate Bands */}
    <path d="M3 10H21" stroke="url(#buy10Grad)" strokeWidth="1.5"/>
    <path d="M3 14H21" stroke="url(#buy10Grad)" strokeWidth="1.5"/>
    <path d="M8 6V18" stroke="url(#buy10Grad)" strokeWidth="1.5"/>
    <path d="M16 6V18" stroke="url(#buy10Grad)" strokeWidth="1.5"/>
    {/* Text Badge */}
    <rect x="8" y="9" width="8" height="6" fill="#1A202C" rx="1" stroke="#4FD1C5" strokeWidth="0.5" />
    <text
      x="12"
      y="12.5"
      fontFamily="'Press Start 2P', cursive"
      fontSize="5"
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      x10
    </text>
  </svg>
);

export default Buy10Icon;
