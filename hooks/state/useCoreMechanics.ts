// hooks/state/useCoreMechanics.ts
import React, { useCallback } from 'react';
import { GameState } from '../../types';
import { CORE_CHARGE_RATE, CORE_DISCHARGE_DURATION, TICK_RATE } from '../../constants';
import { calculateCoreBonuses, calculateAchievementBonuses } from '../../utils/bonusCalculations';
import { calculateTimeToFullCharge } from '../../utils/gameplayCalculations';


type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;

export const useCoreMechanics = (setGameState: SetGameStateFn) => {

    const getComputed = (gameState: GameState) => {
        const coreBonuses = calculateCoreBonuses(gameState);
        const achievementBonuses = calculateAchievementBonuses(gameState.achievements);
        
        const finalChargeRatePerSecond = CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge;
        
        const timeToFullSeconds = calculateTimeToFullCharge(gameState.coreCharge, finalChargeRatePerSecond);
        
        return {
            coreBonuses,
            timeToFullSeconds,
        };
    };

    const calculateCoreCharge = (
        gameState: GameState,
        achievementBonuses: ReturnType<typeof calculateAchievementBonuses>,
        coreBonuses: ReturnType<typeof calculateCoreBonuses>
    ) => {
        let newCoreCharge = gameState.coreCharge;
        if (!gameState.isCoreDischarging && newCoreCharge < 100) {
            const chargeRatePerTick = (CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge) / (1000 / TICK_RATE);
            newCoreCharge = Math.min(100, newCoreCharge + chargeRatePerTick);
        }
        return newCoreCharge;
    };
    
    const dischargeCore = useCallback((): boolean => {
        let success = false;
        setGameState(prev => {
            if (prev.coreCharge >= 100 && !prev.isCoreDischarging) {
                success = true;
                const { coreBonuses } = getComputed(prev);
                return {
                    ...prev,
                    isCoreDischarging: true,
                    coreCharge: 0,
                    coreDischargeEndTimestamp: Date.now() + coreBonuses.duration
                };
            }
            return prev;
        });
        return success;
    }, [setGameState, getComputed]);

    const setHasSeenCoreTutorial = useCallback((seen: boolean) => {
        setGameState(prev => ({ ...prev, hasSeenCoreTutorial: seen }));
    }, [setGameState]);

    return {
        getComputed,
        calculateCoreCharge,
        actions: {
            dischargeCore,
            setHasSeenCoreTutorial,
        },
    };
};