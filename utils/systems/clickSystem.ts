
import { GameState, Achievement, Settings } from '../../types';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';
import { checkAndUnlockAchievement } from '../../hooks/state/useAchievements';

interface ClickSystemDeps {
    clickQueue: {x: number, y: number}[];
    clickPower: number;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    memoizedFormatNumber: (num: number) => string;
    settings: Settings;
}

export const processClickSystem = (
    currentState: GameState, 
    deps: ClickSystemDeps
) => {
    const { clickQueue, clickPower, addFloatingText, memoizedFormatNumber, settings } = deps;
    
    if (clickQueue.length === 0) return { 
        energyFromClicks: 0, 
        clicksProcessed: 0, 
        newAchievements: [] as Achievement[],
        updatedAchievements: currentState.achievements 
    };

    // Visual Feedback
    if (settings.showFloatingText) {
        clickQueue.forEach(click => {
            addFloatingText(`+${memoizedFormatNumber(clickPower)}`, click.x, click.y, '#ffffff');
        });
    }

    // Logic
    const clicksProcessed = clickQueue.length;
    const energyFromClicks = clicksProcessed * clickPower;
    const newTotalClicks = currentState.totalClicks + clicksProcessed;
    
    let achState = currentState.achievements;
    const newAchievements: Achievement[] = [];

    const check = (name: string, cond: boolean) => {
        const { updatedAchievements, unlocked } = checkAndUnlockAchievement(achState, name, cond);
        achState = updatedAchievements;
        if (unlocked) newAchievements.push(unlocked);
    };

    check(ACHIEVEMENT_IDS.CLICK_FRENZY, newTotalClicks >= 1000);
    check(ACHIEVEMENT_IDS.CLICK_STORM, newTotalClicks >= 100000);
    if (currentState.totalClicks === 0) check(ACHIEVEMENT_IDS.INITIAL_SPARK, true);

    return {
        energyFromClicks,
        clicksProcessed, // To update totalClicks
        newAchievements,
        updatedAchievements: achState
    };
};
