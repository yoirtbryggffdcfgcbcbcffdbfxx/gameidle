import React from 'react';

const PercentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <defs>
        <linearGradient id="iconGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#63B3ED"/>
            <stop offset="100%" stopColor="#3182CE"/>
        </linearGradient>
    </defs>
    <g stroke="url(#iconGrad2)">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
    </g>
  </svg>
);
export default PercentIcon;
