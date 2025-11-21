
import React, { useMemo } from 'react';

interface StarFieldProps {
    isWarping: boolean;
}

const StarField: React.FC<StarFieldProps> = ({ isWarping }) => {
    // Génération des étoiles une seule fois pour la performance
    const starsSmall = useMemo(() => 
        Array.from({length: 100}).map(() => `${Math.random() * 100}vw ${Math.random() * 100}vh #FFF`).join(','), 
    []);
    
    const starsMedium = useMemo(() => 
        Array.from({length: 40}).map(() => `${Math.random() * 100}vw ${Math.random() * 100}vh #CCC`).join(','), 
    []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-80 transition-transform duration-[2s]" style={{
                animation: isWarping ? 'space-warp 0.5s linear infinite' : 'space-drift 60s linear infinite',
                transformOrigin: 'center'
            }}>
                <div style={{ width: '1px', height: '1px', boxShadow: starsSmall }} />
                <div style={{ width: '2px', height: '2px', boxShadow: starsMedium }} />
            </div>
        </div>
    );
};

export default StarField;
