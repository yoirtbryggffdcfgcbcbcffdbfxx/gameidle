import React from 'react';

interface AchievementBonusSummaryProps {
    achievementBonuses: {
        production: number;
        click: number;
        coreCharge: number;
        costReduction: number;
    };
}

const AchievementBonusSummary: React.FC<AchievementBonusSummaryProps> = ({ achievementBonuses }) => {
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
        <div className="bg-[var(--bg-upgrade)] p-3 rounded-lg text-center">
            <h3 className="text-base text-yellow-400 mb-2">Bonus Totaux Actifs</h3>
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs">
                {Object.entries(achievementBonuses).map(([key, value]) => {
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
    );
};

export default AchievementBonusSummary;