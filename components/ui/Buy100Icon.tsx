import React from 'react';

const Buy100Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="buy100Grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F56565" />
        <stop offset="100%" stopColor="#C53030" />
      </linearGradient>
    </defs>

    {/* Bottom Crate */}
    <g opacity="0.7">
      <rect x="2" y="12" width="20" height="8" rx="1" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M2 16H22" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M7 12V20" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M17 12V20" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
    </g>

    {/* Top Crate */}
    <g>
      <rect x="4" y="4" width="16" height="10" rx="1" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M4 8H20" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M4 11H20" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M9 4V14" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
      <path d="M15 4V14" stroke="url(#buy100Grad)" strokeWidth="1.5"/>
    </g>

    {/* Text Badge */}
    <rect x="8" y="7" width="8" height="5" fill="#1A202C" rx="1" stroke="#F56565" strokeWidth="0.5" />
    <text
      x="12"
      y="9.5"
      fontFamily="'Press Start 2P', cursive"
      fontSize="3.5"
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      x100
    </text>
  </svg>
);

export default Buy100Icon;
