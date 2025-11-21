
// hooks/useGameLoop.ts
import React, { useEffect, useRef, useCallback } from 'react';
import { GameState, Settings, Achievement } from '../types';
import { TICK_RATE } from '../constants';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { useCoreMechanics } from './state/useCoreMechanics';
import { useGameState } from './useGameState';
import { calculateGiftChance } from '../utils/helpers';
import { LOAN_REPAYMENT_RATE } from '../data/bank'; // Import du taux
// Import des nouveaux systèmes
import { 
    processClickSystem, 
    processCoreSystem, 
    processEconomySystem, 
    processUnlockSystem 
} from '../utils/gameLoopSystems';

type SetGameStateFn = React.Dispatch<React.SetStateAction<GameState>>;
type AddFloatingTextFn = (text: string, x: number, y: number, color: string) => void;
type OnAchievementUnlockFn = (achievement: Achievement) => void;

export const useGameLoop = (
    appState: string,
    loadStatus: string,
    setGameState: SetGameStateFn,
    clickQueue: React.MutableRefObject<{x: number, y: number}[]>,
    prestigeState: ReturnType<typeof usePrestigeState>,
    coreMechanics: ReturnType<typeof useCoreMechanics>,
    bankState: ReturnType<typeof useBankState>,
    onLoanRepaid: () => void,
    addFloatingText: AddFloatingTextFn,
    memoizedFormatNumber: (num: number) => string,
    settings: Settings,
    computed: ReturnType<typeof useGameState>['computed'],
    onAchievementUnlock: OnAchievementUnlockFn
) => {
    const animationFrameId = useRef<number | null>(null);
    const lastTime = useRef<number | null>(null);
    const accumulator = useRef(0);
    const productionTextTickCounter = useRef(0);

    // Ref pour éviter les closures périmées dans la boucle
    const latestProps = useRef({ 
        appState, loadStatus, setGameState, clickQueue, prestigeState, 
        coreMechanics, bankState, onLoanRepaid, addFloatingText, 
        memoizedFormatNumber, settings, computed, onAchievementUnlock 
    });

    useEffect(() => {
        latestProps.current = { 
            appState, loadStatus, setGameState, clickQueue, prestigeState, 
            coreMechanics, bankState, onLoanRepaid, addFloatingText, 
            memoizedFormatNumber, settings, computed, onAchievementUnlock 
        };
    });

    const runGameTick = useCallback((deltaTime: number) => {
        const props = latestProps.current;
        const { setGameState, clickQueue, settings, computed, addFloatingText, memoizedFormatNumber, bankState, prestigeState, onLoanRepaid, onAchievementUnlock } = props;

        // Extraction de la file d'attente des clics
        const currentClicks = [...clickQueue.current];
        clickQueue.current = [];
        
        setGameState(prev => {
            const newlyUnlockedAchievements: Achievement[] = [];

            // 1. SYSTEM: CLICKS
            const clickResult = processClickSystem(prev, {
                clickQueue: currentClicks,
                clickPower: computed.clickPower,
                addFloatingText,
                memoizedFormatNumber,
                settings
            });
            if (clickResult.newAchievements.length > 0) newlyUnlockedAchievements.push(...clickResult.newAchievements);

            // 2. SYSTEM: CORE STATE (Discharge timer)
            const coreStateResult = processCoreSystem(prev);

            // 3. SYSTEM: ECONOMY (Production, Bank, Core Charge)
            const economyResult = processEconomySystem(prev, coreStateResult, {
                gameState: prev,
                deltaTime,
                prestigeStateComputed: { maxEnergy: prestigeState.getComputed(prev).maxEnergy },
                bankState
            });
            
            if (economyResult.wasLoanRepaid) onLoanRepaid();

            // 4. TALLYING RESOURCES
            const newTotalEnergyProduced = prev.totalEnergyProduced + economyResult.productionThisFrame + clickResult.energyFromClicks;
            const potentialNewEnergy = prev.energy + economyResult.energyFromProduction + clickResult.energyFromClicks;
            
            // Utilisation de energyCap (qui peut être Infinity) au lieu de maxEnergy pour la limite
            const energyCap = prestigeState.getComputed(prev).energyCap;
            const newEnergy = Math.min(potentialNewEnergy, energyCap);

            // 5. SYSTEM: UNLOCKS
            const unlockResult = processUnlockSystem(prev, newEnergy);

            // 6. FLOATING TEXT & GIFT CHECK (1s interval)
            productionTextTickCounter.current++;
            let newActiveGift = prev.activeGift;

            if (productionTextTickCounter.current >= 10) {
                // Floating Text
                if (economyResult.productionTotal > 0 && settings.showFloatingText) {
                    const energyBar = document.getElementById('energy-bar-container');
                    if (energyBar) {
                        const rect = energyBar.getBoundingClientRect();
                        
                        // CALCUL DU NET POUR L'AFFICHAGE
                        let displayProduction = economyResult.productionTotal;
                        if (prev.currentLoan && prev.currentLoan.remaining > 0) {
                            displayProduction *= (1 - LOAN_REPAYMENT_RATE);
                        }

                        // On n'affiche le texte que si la production nette est positive (évite +0 si tout part dans le prêt, quoique rare avec 50%)
                        if (displayProduction > 0) {
                            const text = `+${memoizedFormatNumber(displayProduction)}`;
                            // Couleur orange si prêt actif pour indiquer la réduction, sinon or
                            const color = (prev.currentLoan && prev.currentLoan.remaining > 0) ? '#fb923c' : '#ffdd00'; 
                            addFloatingText(text, rect.left + rect.width / 2, rect.top, color);
                        }
                    }
                }

                // Gift Check
                if (!newActiveGift) {
                    const giftUpgrade = prev.upgrades.find(u => u.id === 'boost_gift_1');
                    if (giftUpgrade && giftUpgrade.owned > 0) {
                        const chance = calculateGiftChance(giftUpgrade.owned);
                        // Roll (0-100)
                        if (Math.random() * 100 < chance) {
                            // Snapshot current energy
                            newActiveGift = {
                                value: newEnergy,
                                timestamp: Date.now()
                            };
                        }
                    }
                }

                productionTextTickCounter.current = 0;
            }

            // 7. HISTORY UPDATE
            let newProductionHistory = [...prev.productionHistory, { value: economyResult.productionThisFrame, duration: deltaTime }];
            let totalDuration = newProductionHistory.reduce((sum, p) => sum + p.duration, 0);
            while (totalDuration > 10000 && newProductionHistory.length > 1) {
                totalDuration -= newProductionHistory.shift()!.duration;
            }

            // 8. SIDE EFFECTS (Achievements)
            if (newlyUnlockedAchievements.length > 0) {
                setTimeout(() => newlyUnlockedAchievements.forEach(onAchievementUnlock), 0);
            }

            // 9. FINAL STATE MERGE
            return {
                ...prev,
                achievements: clickResult.updatedAchievements,
                totalClicks: prev.totalClicks + clickResult.clicksProcessed,
                isCoreDischarging: coreStateResult.isCoreDischarging,
                coreDischargeEndTimestamp: coreStateResult.coreDischargeEndTimestamp,
                energy: newEnergy,
                coreCharge: unlockResult.coreChargeReset ? 0 : economyResult.newCoreCharge,
                totalEnergyProduced: newTotalEnergyProduced,
                savingsBalance: economyResult.newSavingsBalance,
                currentLoan: economyResult.newLoan,
                productionHistory: newProductionHistory,
                activeGift: newActiveGift,
                ...unlockResult.updates // Merge unlocks (shop, core, bank)
            };
        });
    }, []);

    useEffect(() => {
        const mainLoop = (timestamp: number) => {
            animationFrameId.current = requestAnimationFrame(mainLoop);
            const { appState, loadStatus } = latestProps.current;
            if (appState !== 'game' || loadStatus === 'loading') return;

            if (lastTime.current === null) lastTime.current = timestamp;
            
            const deltaTime = timestamp - lastTime.current;
            lastTime.current = timestamp;
            accumulator.current += deltaTime;

            while (accumulator.current >= TICK_RATE) {
                runGameTick(TICK_RATE);
                accumulator.current -= TICK_RATE;
            }
        };

        if (appState === 'game' && loadStatus !== 'loading') {
            lastTime.current = performance.now();
            accumulator.current = 0;
            animationFrameId.current = requestAnimationFrame(mainLoop);
        }

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            lastTime.current = null;
            accumulator.current = 0;
            productionTextTickCounter.current = 0;
        };
    }, [appState, loadStatus, runGameTick]);
};
