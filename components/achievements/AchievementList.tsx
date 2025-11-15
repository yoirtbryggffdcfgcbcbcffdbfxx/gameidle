import React from 'react';
import { Achievement } from '../../types';
import AchievementCard from '../ui/AchievementCard';

interface AchievementListProps {
    achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
    return (
        <div className="grid grid-cols-1 gap-3">
            {achievements.map((ach) => (
                <AchievementCard key={ach.name} achievement={ach} />
            ))}
        </div>
    );
};

export default AchievementList;