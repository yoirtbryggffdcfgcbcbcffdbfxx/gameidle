import React, { useMemo } from 'react';
import { Achievement } from '../../types';
import AchievementCard from '../ui/AchievementCard';

interface LockedAchievementsListProps {
    achievements: Achievement[];
}

const bonusTypeOrder: Achievement['bonus']['type'][] = ['PRODUCTION', 'CLICK', 'CORE_CHARGE', 'COST_REDUCTION'];

const groupTitles: Record<Achievement['bonus']['type'], string> = {
    PRODUCTION: 'Production',
    CLICK: 'Puissance de Clic',
    CORE_CHARGE: 'Cœur Quantique',
    COST_REDUCTION: 'Économie'
};

const LockedAchievementsList: React.FC<LockedAchievementsListProps> = ({ achievements }) => {
    const { groupedVisible, hidden } = useMemo(() => {
        const visible = achievements.filter(a => !a.hidden);
        const hiddenAchievements = achievements.filter(a => a.hidden);

        const grouped = visible.reduce((acc, ach) => {
            const type = ach.bonus.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(ach);
            return acc;
        }, {} as Record<Achievement['bonus']['type'], Achievement[]>);

        return { groupedVisible: grouped, hidden: hiddenAchievements };
    }, [achievements]);

    return (
        <div className="space-y-4">
            {bonusTypeOrder.map(type => {
                const group = groupedVisible[type];
                if (!group || group.length === 0) return null;

                return (
                    <div key={type}>
                        <h3 className="text-sm font-bold text-gray-400 my-2 pl-1 border-b border-gray-700 pb-1">{groupTitles[type]}</h3>
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            {group.map(ach => <AchievementCard key={ach.name} achievement={ach} />)}
                        </div>
                    </div>
                );
            })}

            {hidden.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-400 my-2 pl-1 border-b border-gray-700 pb-1">Secrets</h3>
                     <div className="grid grid-cols-1 gap-3 pt-2">
                        {hidden.map(ach => <AchievementCard key={ach.name} achievement={ach} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LockedAchievementsList;