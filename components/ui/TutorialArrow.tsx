
import React from 'react';

interface TutorialArrowProps {
    direction: 'up' | 'down';
    style: React.CSSProperties;
}

const TutorialArrow: React.FC<TutorialArrowProps> = ({ direction, style }) => {
    const baseClasses = 'absolute w-0 h-0 z-[-1] animate-pulse';
    const directionClass = direction === 'up' 
        ? 'border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[20px] border-b-cyan-500'
        : 'border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-cyan-500';
    
    return <div className={`${baseClasses} ${directionClass}`} style={style} />;
};

export default TutorialArrow;
