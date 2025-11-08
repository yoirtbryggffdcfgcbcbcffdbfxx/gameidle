import React from 'react';
import Popup from './Popup';
import { Achievement } from '../../types';
import AchievementCard from '../ui/AchievementCard';

interface AchievementsPopupProps {
    achievements: Achievement[];
    achievementBonuses: {
        production: number;
        click: number;
        coreCharge: number;
        costReduction: number;
    };
    onClose: () => void;
}

const AchievementsPopup: React.FC<AchievementsPopupProps> = ({ achievements, achievementBonuses, onClose }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    const bonusLabels = {
        production: "Production",
        click: "Puissance de Clic",
        coreCharge: "Charge du Cœur",
        costReduction: "Réduction de Coût",
    };

    const formatBonusValue = (key: keyof typeof achievementBonuses, value: number) => {
        if (key === 'costReduction') {
            return `-${((1 - value) * 100).toFixed(0)}%`;
        }
        return `+${((value - 1) * 100).toFixed(0)}%`;
    };

    return (
        <Popup title={`Succès (${unlockedCount}/${achievements.length})`} onClose={onClose} widthClass="w-[95%] max-w-3xl">
            <div className="space-y-4">
                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg text-center">
                    <h3 className="text-base text-yellow-400 mb-2">Bonus Totaux Actifs</h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs">
                        {Object.entries(achievementBonuses).map(([key, value]) => {
                            if ((key !== 'costReduction' && value > 1) || (key === 'costReduction' && value < 1)) {
                                return (
                                    <span key={key} className="bg-black/30 px-2 py-1 rounded">
                                        {bonusLabels[key as keyof typeof bonusLabels]}: <strong className="text-green-400">{formatBonusValue(key as keyof typeof bonusLabels, value)}</strong>
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {achievements.map((ach) => (
                            <AchievementCard key={ach.name} achievement={ach} />
                        ))}
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default AchievementsPopup;