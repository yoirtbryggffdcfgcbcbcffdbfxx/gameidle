import React from 'react';
import { Achievement } from '../../types';
import MousePointerIcon from './MousePointerIcon';
import ColoredAwardIcon from './ColoredAwardIcon';
import LockIcon from './LockIcon';

interface AchievementCardProps {
    achievement: Achievement;
}

const bonusInfo: { [key in Achievement['bonus']['type']]: { icon: React.ReactNode; label: string; color: string } } = {
    PRODUCTION: { icon: '⚡', label: 'Production', color: 'text-yellow-400' },
    CLICK: { icon: <MousePointerIcon className="w-5 h-5" />, label: 'Puissance de Clic', color: 'text-cyan-400' },
    CORE_CHARGE: { icon: '⚛️', label: 'Charge du Coeur', color: 'text-purple-400' },
    COST_REDUCTION: { icon: '💰', label: 'Réduction de Coût', color: 'text-green-400' },
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    const { name, unlocked, hidden, description, bonus, relatedUpgradeName } = achievement;
    
    const isSecretAndLocked = hidden && !unlocked;

    const containerClasses = `
        p-3 rounded-lg border-l-4 flex flex-col justify-between h-full transition-all duration-300
        ${unlocked 
            ? 'bg-gradient-to-br from-[var(--bg-upgrade)] to-[var(--bg-popup)] border-cyan-400' 
            : isSecretAndLocked
                ? 'bg-black/30 border-dashed border-gray-500 opacity-60'
                : 'bg-[var(--bg-upgrade)] border-gray-600 opacity-50'
        }
    `;

    const titleColor = unlocked ? 'text-[var(--text-bright)]' : 'text-gray-400';
    const title = isSecretAndLocked ? "Succès Secret" : name;
    const desc = isSecretAndLocked ? "Débloquez ce succès pour révéler ses détails." : description;
    
    const icon = unlocked 
        ? <ColoredAwardIcon className="w-8 h-8" /> 
        : <LockIcon className="w-8 h-8 text-gray-500" />;

    const bonusData = bonusInfo[bonus.type];
    const bonusValueText = bonus.type === 'COST_REDUCTION' ? `-${bonus.value}%` : `+${bonus.value}%`;

    return (
        <div className={containerClasses}>
            <div>
                <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0">{icon}</div>
                    <div>
                        <strong className={`text-base ${titleColor}`}>{title}</strong>
                        <p className="text-sm mt-1 opacity-80">{desc}</p>
                    </div>
                </div>
                {relatedUpgradeName && !isSecretAndLocked && (
                    <p className={`text-xs mt-2 pl-11 ${unlocked ? 'text-cyan-300 opacity-90' : 'text-gray-500'}`}>
                        Lié à : <span className="font-semibold">{relatedUpgradeName}</span>
                    </p>
                )}
            </div>
            {!isSecretAndLocked && (
                <div className={`mt-2 pt-2 border-t ${unlocked ? 'border-cyan-500/30' : 'border-gray-600/50'} flex items-center space-x-2 pl-11`}>
                    {typeof bonusData.icon === 'string' ? (
                        <span className={`text-xl ${unlocked ? bonusData.color : 'text-gray-400'}`}>{bonusData.icon}</span>
                    ) : (
                        <div className={`w-5 h-5 ${unlocked ? bonusData.color : 'text-gray-400'}`}>{bonusData.icon}</div>
                    )}
                    <div className="text-xs">
                        <span className="font-semibold">Bonus: </span>
                        <span className={unlocked ? bonusData.color : ''}>{bonusValueText} {bonusData.label}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AchievementCard;