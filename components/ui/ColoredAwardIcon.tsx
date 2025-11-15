import React from 'react';

interface IconProps {
    className?: string;
}

const ColoredAwardIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
    >
        <defs>
            <linearGradient id="trophyGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFDF00' }} />
                <stop offset="100%" style={{ stopColor: '#B8860B' }} />
            </linearGradient>
        </defs>
        <path fill="url(#trophyGold)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path fill="url(#trophyGold)" d="M12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        <path fill="#4A90E2" d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11-2.79-1.11-2-2-2 2z"/>
        <path fill="url(#trophyGold)" d="M12 11c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
);

export default ColoredAwardIcon;