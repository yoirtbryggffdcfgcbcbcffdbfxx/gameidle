import React from 'react';

interface IconProps {
    className?: string;
}

const ShopIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
    >
        <defs>
            <linearGradient id="shopIconGoldFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFDF00' }} />
                <stop offset="100%" style={{ stopColor: '#B8860B' }} />
            </linearGradient>
            <filter id="shopIconGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#shopIconGlowFilter)">
            {/* Bag Body */}
            <path 
                d="M5 9h14l-1.5 10H6.5L5 9z" 
                fill="rgba(255, 223, 0, 0.1)"
                stroke="#FFDF00" 
                strokeWidth="1.5"
            />
            {/* Bag Handle */}
            <path d="M9 9V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" stroke="#FFDF00" strokeWidth="1.5" fill="none" />
            
            {/* Inner Quantum Fragment */}
            <path d="M12 11l2.5 3L12 17l-2.5-3Z" fill="url(#shopIconGoldFill)" stroke="#FFF" strokeWidth="0.5"/>
        </g>
    </svg>
);

export default ShopIcon;