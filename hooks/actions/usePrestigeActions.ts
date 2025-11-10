import { useCallback, useRef } from 'react';
import { GameState } from '../../types';
import { ASCENSION_UPGRADES, CORE_UPGRADES } from '../../constants';
// FIX: Corrected import path for `getInitialState`. It is exported from `utils/helpers.ts`, not `useGameState.ts`.
import { getInitialState } from '../../utils/helpers';

export const usePrestigeActions = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    gameState: GameState,
    canAscend: boolean,
    ascensionGain: number,
    ascensionBonuses: { startingEnergy: number },
    coreBonuses: { duration: number },
    checkAchievement: (name: string, condition: boolean) => void
) => {
    const dischargeTimer = useRef<number | null>(null);

    const doAscension = useCallback((): boolean => {
        if (!canAscend) return false;
        
        const nextAscensionLevel = gameState.ascensionLevel + 1;
        checkAchievement("Transcendance", nextAscensionLevel >= 5);
        checkAchievement("Maître du Multivers", nextAscensionLevel >= 10);
        checkAchievement("Légende Éternelle", nextAscensionLevel >= 25);
        
        setGameState(prev => {
            const initialState = getInitialState();
            return {
                ...initialState,
                energy: ascensionBonuses.startingEnergy,
                ascensionLevel: prev.ascensionLevel + 1,
                ascensionPoints: prev.ascensionPoints + ascensionGain,
                quantumShards: prev.quantumShards + ascensionGain,
                achievements: prev.achievements,
                purchasedAscensionUpgrades: prev.purchasedAscensionUpgrades,
                purchasedCoreUpgrades: prev.purchasedCoreUpgrades,
                purchasedShopUpgrades: prev.purchasedShopUpgrades,
                hasSeenAscensionTutorial: true,
                hasSeenCoreTutorial: prev.hasSeenCoreTutorial,
                hasSeenBankTutorial: prev.hasSeenBankTutorial,
                totalClicks: prev.totalClicks,
                isBankUnlocked: prev.isBankUnlocked,
                bankLevel: prev.bankLevel,
            };
        });
        return true;
    }, [canAscend, gameState.ascensionLevel, ascensionBonuses.startingEnergy, ascensionGain, setGameState, checkAchievement]);
    
    const buyAscensionUpgrade = useCallback((id: string): boolean => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        let success = false;

        setGameState(prev => {
            const canAfford = prev.ascensionPoints >= upgrade.cost;
            const isPurchased = prev.purchasedAscensionUpgrades.includes(id);
            const requirementsMet = upgrade.required.every(reqId => prev.purchasedAscensionUpgrades.includes(reqId));

            if (canAfford && !isPurchased && requirementsMet) {
                success = true;
                const shouldUnlockAchievement = prev.purchasedAscensionUpgrades.length === 1;

                if (shouldUnlockAchievement) {
                    checkAchievement("Première Transcendance", true);
                }

                return {
                    ...prev,
                    ascensionPoints: prev.ascensionPoints - upgrade.cost,
                    purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, id],
                };
            }
            return prev;
        });
        return success;
    }, [setGameState, checkAchievement]);

    const buyCoreUpgrade = useCallback((id: string): boolean => {
        const upgrade = CORE_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        let success = false;

        setGameState(prev => {
            const canAfford = prev.quantumShards >= upgrade.cost;
            const isPurchased = prev.purchasedCoreUpgrades.includes(id);
            const requirementsMet = upgrade.required.every(reqId => prev.purchasedCoreUpgrades.includes(reqId));

            if (canAfford && !isPurchased && requirementsMet) {
                success = true;
                const shouldUnlockAchievement = prev.purchasedCoreUpgrades.length === 1;
                
                if (shouldUnlockAchievement) {
                    checkAchievement("Noyau Amélioré", true);
                }

                return {
                    ...prev,
                    quantumShards: prev.quantumShards - upgrade.cost,
                    purchasedCoreUpgrades: [...prev.purchasedCoreUpgrades, id],
                };
            }
            return prev;
        });
        return success;
    }, [setGameState, checkAchievement]);

    const dischargeCore = useCallback((): boolean => {
        let success = false;
        setGameState(prev => {
            if (prev.coreCharge >= 100 && !prev.isCoreDischarging) {
                success = true;

                if (dischargeTimer.current) clearTimeout(dischargeTimer.current);
                dischargeTimer.current = window.setTimeout(() => {
                    setGameState(p => ({ ...p, isCoreDischarging: false }));
                    dischargeTimer.current = null;
                }, coreBonuses.duration);

                return { ...prev, isCoreDischarging: true, coreCharge: 0 };
            }
            return prev;
        });
        return success;
    }, [coreBonuses.duration, setGameState]);

    return { doAscension, buyAscensionUpgrade, buyCoreUpgrade, dischargeCore };
};