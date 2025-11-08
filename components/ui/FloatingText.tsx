import React, { useEffect } from 'react';

interface FloatingTextProps {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
    onComplete: (id: number) => void;
}

const FloatingText: React.FC<FloatingTextProps> = ({ id, text, x, y, color, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete(id);
        }, 1500); // Corresponds to animation duration

        return () => clearTimeout(timer);
    }, [id, onComplete]);

    const style: React.CSSProperties = {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translateX(-50%)',
        color: color,
        fontWeight: 'bold',
        pointerEvents: 'none',
        zIndex: 2000,
        textShadow: '1px 1px 2px black',
    };

    return (
        <div style={style} className="animate-float-up">
            {text}
        </div>
    );
};

export default FloatingText;