// FIX: This file was created to resolve module not found errors.
import React from 'react';
import Popup from './Popup';
import { Achievement } from '../../types';
import AchievementCard from '../ui/AchievementCard';

interface AchievementsPopupProps {
    achievements: Achievement[];
    onClose: () => void;
}

const AchievementsPopup: React.FC<AchievementsPopupProps> = ({ achievements, onClose }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    return (
        <Popup title={`Succès (${unlockedCount}/${achievements.length})`} onClose={onClose}>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {achievements.map((ach) => (
                    <AchievementCard key={ach.name} achievement={ach} />
                ))}
            </div>
        </Popup>
    );
};

export default AchievementsPopup;
