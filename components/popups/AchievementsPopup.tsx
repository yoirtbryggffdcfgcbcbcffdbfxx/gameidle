import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Achievement } from '../../types';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import AchievementBonusSummary from '../achievements/AchievementBonusSummary';
import AchievementList from '../achievements/AchievementList';
import LockedAchievementsList from '../achievements/LockedAchievementsList';

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
    const [activeTab, setActiveTab] = useState<'unlocked' | 'locked'>('unlocked');
    const scrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(scrollableRef);

    const { unlockedAchievements, lockedAchievements } = useMemo(() => {
        const unlocked = achievements.filter(a => a.unlocked);
        const locked = achievements.filter(a => !a.unlocked);
        return { unlockedAchievements: unlocked, lockedAchievements: locked };
    }, [achievements]);

    useEffect(() => {
        const scrollEl = scrollableRef.current;
        const gameContentEl = document.getElementById('game-content');
        if (!scrollEl || !gameContentEl) return;

        const lockScroll = () => { gameContentEl.style.overflowY = 'hidden'; };
        const unlockScroll = () => { gameContentEl.style.overflowY = 'auto'; };

        scrollEl.addEventListener('mouseenter', lockScroll);
        scrollEl.addEventListener('mouseleave', unlockScroll);
        scrollEl.addEventListener('touchstart', lockScroll, { passive: true });
        scrollEl.addEventListener('touchend', unlockScroll);
        scrollEl.addEventListener('touchcancel', unlockScroll);

        return () => {
            scrollEl.removeEventListener('mouseenter', lockScroll);
            scrollEl.removeEventListener('mouseleave', unlockScroll);
            scrollEl.removeEventListener('touchstart', lockScroll);
            scrollEl.removeEventListener('touchend', unlockScroll);
            scrollEl.removeEventListener('touchcancel', unlockScroll);
            unlockScroll();
        };
    }, []);

    return (
        <div className="h-full flex flex-col -mx-4 -my-4">
            <div className="px-4 pt-4">
                <AchievementBonusSummary achievementBonuses={achievementBonuses} />

                <div className="flex justify-center border-b border-[var(--border-color)] mt-4">
                    <button
                        onClick={() => setActiveTab('unlocked')}
                        className={`px-4 py-2 text-sm transition-all duration-300 relative ${activeTab === 'unlocked' ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                    >
                        Débloqués ({unlockedAchievements.length})
                        {activeTab === 'unlocked' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('locked')}
                        className={`px-4 py-2 text-sm transition-all duration-300 relative ${activeTab === 'locked' ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                    >
                        Verrouillés ({lockedAchievements.length})
                        {activeTab === 'locked' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                    </button>
                </div>
            </div>
            
            <div ref={scrollableRef} className="flex-grow overflow-y-auto pr-2 custom-scrollbar mt-4 scroll-contain px-4">
                {activeTab === 'unlocked' ? (
                    <AchievementList achievements={unlockedAchievements} />
                ) : (
                    <LockedAchievementsList achievements={lockedAchievements} />
                )}
            </div>
        </div>
    );
};

export default AchievementsPopup;