// FIX: This file was created to resolve module not found errors.
import React from 'react';
import { Achievement } from '../../types';

interface AchievementCardProps {
    achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    const unlockedClass = achievement.unlocked ? 'opacity-100 border-cyan-400' : 'opacity-50 border-gray-600';
    const icon = achievement.unlocked ? '🏆' : '🔒';

    return (
        <div className={`bg-[var(--bg-upgrade)] p-3 my-2 rounded-lg border-l-4 transition-all duration-300 ${unlockedClass}`}>
            <div className="flex items-center">
                <span className="text-2xl mr-3">{icon}</span>
                <div>
                    <strong className="text-base text-[var(--text-bright)]">{achievement.name}</strong>
                    <p className="text-sm opacity-80 mt-1">{achievement.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;
