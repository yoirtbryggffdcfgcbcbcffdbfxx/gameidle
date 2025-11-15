import React from 'react';

const AIAvatar: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="50" height="50" viewBox="0 0 100 100" className={`flex-shrink-0 ${className}`}>
        <defs>
            <radialGradient id="ai-grad-core" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#0b022d" />
            </radialGradient>
            <filter id="ai-glow-core" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#ai-glow-core)">
            <path d="M 20 50 A 30 30 0 1 1 80 50 L 80 80 A 30 30 0 1 1 20 80 Z" fill="#222" stroke="#00f5d4" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="url(#ai-grad-core)" />
            <circle cx="50" cy="50" r="5" fill="#fff" />
        </g>
    </svg>
);

export default AIAvatar;
