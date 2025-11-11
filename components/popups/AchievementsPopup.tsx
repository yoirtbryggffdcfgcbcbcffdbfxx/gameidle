import React, { useRef } from 'react';
import { Achievement } from '../../types';
import AchievementCard from '../ui/AchievementCard';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';

interface AchievementsPopupProps {
    achievements: Achievement[];
    achievementBonuses: {
        production: number;
        click: number;
        coreCharge: number;
        costReduction: number;
    };
    onClose: () => void; // Kept for prop compatibility, but not used
}

const AchievementsPopup: React.FC<AchievementsPopupProps> = ({ achievements, achievementBonuses }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

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
        <div className="h-full flex flex-col">
            <h2 className="text-2xl text-center text-[var(--text-header)] mb-4">Succès ({unlockedCount}/{achievements.length})</h2>
            <div className="space-y-4 flex-grow overflow-hidden flex flex-col">
                <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg text-center">
                    <h3 className="text-base text-yellow-400 mb-2">Bonus Totaux Actifs</h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs">
                        {Object.entries(achievementBonuses).map(([key, value]) => {
                            // FIX: Cast `value` from `unknown` to `number` for comparison and to satisfy `formatBonusValue` signature. `Object.entries` can result in a broad `unknown` type for values.
                            if ((key !== 'costReduction' && (value as number) > 1) || (key === 'costReduction' && (value as number) < 1)) {
                                return (
                                    <span key={key} className="bg-black/30 px-2 py-1 rounded">
                                        {bonusLabels[key as keyof typeof bonusLabels]}: <strong className="text-green-400">{formatBonusValue(key as keyof typeof bonusLabels, value as number)}</strong>
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div ref={scrollableRef} className="flex-grow overflow-y-auto pr-2 custom-scrollbar mt-4 scroll-contain">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {achievements.map((ach) => (
                            <AchievementCard key={ach.name} achievement={ach} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsPopup;