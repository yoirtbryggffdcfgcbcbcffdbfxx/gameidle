import React from 'react';

const MaxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
        <linearGradient id="iconGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B794F4"/>
            <stop offset="100%" stopColor="#805AD5"/>
        </linearGradient>
    </defs>
    <text x="12" y="16" fontFamily="'Press Start 2P', cursive" fontSize="16" fill="url(#iconGrad5)" textAnchor="middle" fontWeight="bold">∞</text>
  </svg>
);

export default MaxIcon;
