import React from 'react';

interface IconProps {
    className?: string;
}

const PaletteIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.424-.16-.832-.435-1.125-.275-.293-.435-.69-.435-1.108 0-.926.746-1.648 1.667-1.648.926 0 1.648-.746 1.648-1.667 0-.424-.16-.832-.435-1.125-.275-.293-.435-.69-.435-1.108 0-.926.746-1.648 1.667-1.648.926 0 1.648-.746 1.648-1.667 0-.926-.746-1.648-1.648-1.648A10 10 0 0 0 12 2z" />
    </svg>
);

export default PaletteIcon;
