import React from 'react';
import Popup from './Popup';
import { Achievement } from '../../types';

interface AchievementsPopupProps {
    achievements: Achievement[];
    onClose: () => void;
}

const AchievementsPopup: React.FC<AchievementsPopupProps> = ({ achievements, onClose }) => {
    return (
        <Popup title="Succès" onClose={onClose}>
            {achievements.map((a, i) => (
                <div key={i} className={`p-2 my-1 rounded ${a.unlocked ? 'bg-green-800/50' : 'bg-gray-700/50'}`}>
                    <span>{a.unlocked ? '✅' : '❌'}</span> {a.name}
                    <p className="text-xs opacity-70 pl-6">{a.description}</p>
                </div>
            ))}
        </Popup>
    );
};

export default AchievementsPopup;
