import React, { useState, useEffect } from 'react';
import { Achievement } from '../../types';

interface AchievementToastProps {
    achievement: Achievement | null;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
    const [displayData, setDisplayData] = useState<Achievement | null>(null);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (achievement) {
            setDisplayData(achievement);
            setAnimationClass('animate-toast-in');
        } else if (displayData) {
            // Déclenche l'animation de masquage uniquement s'il y a des données à afficher
            setAnimationClass('animate-toast-out');
            
            // Une fois l'animation de masquage terminée, retire le composant du DOM
            const unmountTimer = setTimeout(() => {
                setDisplayData(null);
            }, 300); // Doit correspondre à la durée de l'animation CSS
            
            return () => clearTimeout(unmountTimer);
        }
    }, [achievement, displayData]);

    if (!displayData) {
        return null;
    }
    
    // La barre de progression ne doit être visible que lorsque le toast s'affiche, pas lorsqu'il disparaît.
    const showProgressBar = animationClass === 'animate-toast-in';

    return (
        <div
            className={`fixed top-4 right-4 w-48 max-w-[80%] bg-gradient-to-br from-gray-800 to-black p-1.5 rounded-lg border-l-4 border-yellow-400 shadow-2xl shadow-yellow-500/20 z-[2500] ${animationClass}`}
        >
            <div className="flex items-start">
                <span className="text-base mr-1.5 text-yellow-400">🏆</span>
                <div>
                    <h4 className="font-normal text-yellow-400 text-xs">Succès Débloqué!</h4>
                    <p className="text-white font-semibold text-xs">{displayData.name}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5 leading-tight">{displayData.description}</p>
                </div>
            </div>
            {showProgressBar && (
                 <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/50 rounded-b-lg overflow-hidden">
                    <div className="h-full bg-yellow-400 animate-progress-shrink" style={{ animationDuration: '1s' }}></div>
                </div>
            )}
        </div>
    );
};

export default AchievementToast;