import React from 'react';

const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <defs>
        <linearGradient id="iconGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#68D391"/>
            <stop offset="100%" stopColor="#38A169"/>
        </linearGradient>
    </defs>
    <g stroke="url(#iconGrad3)">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </g>
  </svg>
);
export default TrendingUpIcon;
