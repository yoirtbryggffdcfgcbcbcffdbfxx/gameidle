import { useCallback, useRef } from 'react';
import { GameState } from '../../types';
import { ASCENSION_UPGRADES, CORE_UPGRADES } from '../../constants';
import { getInitialState } from '../useGameState';

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
    }, [canAscend, gameState, ascensionBonuses.startingEnergy, ascensionGain, setGameState, checkAchievement]);
    
    const buyAscensionUpgrade = useCallback((id: string): boolean => {
        const upgrade = ASCENSION_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        const { ascensionPoints, purchasedAscensionUpgrades } = gameState;
        const canAfford = ascensionPoints >= upgrade.cost;
        const isPurchased = purchasedAscensionUpgrades.includes(id);
        const requirementsMet = upgrade.required.every(reqId => purchasedAscensionUpgrades.includes(reqId));

        if (canAfford && !isPurchased && requirementsMet) {
            // CORRECTION BUG : Vérifie la condition AVANT la mise à jour de l'état pour éviter les problèmes de "stale state".
            // 'start' est inclus, donc le premier achat fera passer la longueur de 1 à 2.
            const shouldUnlockAchievement = purchasedAscensionUpgrades.length === 1;

            setGameState(prev => ({
                ...prev,
                ascensionPoints: prev.ascensionPoints - upgrade.cost,
                purchasedAscensionUpgrades: [...prev.purchasedAscensionUpgrades, id],
            }));

            if (shouldUnlockAchievement) {
                checkAchievement("Première Transcendance", true);
            }
            return true;
        }
        return false;
    }, [gameState, setGameState, checkAchievement]);

    const buyCoreUpgrade = useCallback((id: string): boolean => {
        const upgrade = CORE_UPGRADES.find(u => u.id === id);
        if (!upgrade || upgrade.cost === 0) return false;

        const { quantumShards, purchasedCoreUpgrades } = gameState;
        const canAfford = quantumShards >= upgrade.cost;
        const isPurchased = purchasedCoreUpgrades.includes(id);
        const requirementsMet = upgrade.required.every(reqId => purchasedCoreUpgrades.includes(reqId));
        
        if (canAfford && !isPurchased && requirementsMet) {
            // CORRECTION BUG : Même logique que pour l'ascension pour éviter le "stale state".
            const shouldUnlockAchievement = purchasedCoreUpgrades.length === 1;

            setGameState(prev => ({
                ...prev,
                quantumShards: prev.quantumShards - upgrade.cost,
                purchasedCoreUpgrades: [...prev.purchasedCoreUpgrades, id],
            }));

            if (shouldUnlockAchievement) {
                checkAchievement("Noyau Amélioré", true);
            }
            return true;
        }
        return false;
    }, [gameState, setGameState, checkAchievement]);

    const dischargeCore = useCallback((): boolean => {
        if (gameState.coreCharge >= 100 && !gameState.isCoreDischarging) {
            setGameState(prev => ({ ...prev, isCoreDischarging: true, coreCharge: 0 }));

            if (dischargeTimer.current) clearTimeout(dischargeTimer.current);
            dischargeTimer.current = window.setTimeout(() => {
                setGameState(prev => ({ ...prev, isCoreDischarging: false }));
                dischargeTimer.current = null;
            }, coreBonuses.duration);

            return true;
        }
        return false;
    }, [gameState.coreCharge, gameState.isCoreDischarging, coreBonuses.duration, setGameState]);

    return { doAscension, buyAscensionUpgrade, buyCoreUpgrade, dischargeCore };
};
