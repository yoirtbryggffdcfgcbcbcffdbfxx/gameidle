// hooks/useGameLoop.ts
import React, { useEffect, useRef, useCallback } from 'react';
import { GameState, Settings, Achievement } from '../types';
import { CORE_CHARGE_RATE, TICK_RATE } from '../constants';
import { LOAN_REPAYMENT_RATE } from '../data/bank';
import { usePrestigeState } from './state/usePrestigeState';
import { useBankState } from './state/useBankState';
import { SHOP_UNLOCK_TOTAL_ENERGY } from '../data/shop';
import { CORE_UNLOCK_TOTAL_ENERGY } from '../data/core';
import { BANK_UNLOCK_TOTAL_ENERGY } from '../data/bank';
import { useCoreMechanics } from './state/useCoreMechanics';
import { calculateProduction } from '../utils/gameplayCalculations';
import { calculateAscensionBonuses, calculateAchievementBonuses, calculateCoreBonuses } from '../utils/bonusCalculations';
import { useGameState } from './useGameState';
import { checkAndUnlockAchievement } from './state/useAchievements';
import { ACHIEVEMENT_IDS } from '../constants/achievements';

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

    // New ref for 1-second floating text
    const productionTextTickCounter = useRef(0);

    const latestProps = useRef({ appState, loadStatus, setGameState, clickQueue, prestigeState, coreMechanics, bankState, onLoanRepaid, addFloatingText, memoizedFormatNumber, settings, computed, onAchievementUnlock });
    useEffect(() => {
        // Update ref with latest props on every render to avoid stale closures in the loop
        latestProps.current = { appState, loadStatus, setGameState, clickQueue, prestigeState, coreMechanics, bankState, onLoanRepaid, addFloatingText, memoizedFormatNumber, settings, computed, onAchievementUnlock };
    });

    const runGameTick = useCallback((deltaTime: number) => {
        const {
            clickQueue,
            settings,
            computed,
            addFloatingText,
            memoizedFormatNumber,
            setGameState,
            prestigeState,
            bankState,
            onLoanRepaid,
            onAchievementUnlock
        } = latestProps.current;

        const clicksToProcess = [...clickQueue.current];
        clickQueue.current = [];

        if (clicksToProcess.length > 0 && settings.showFloatingText) {
            const clickPower = computed.clickPower;
            clicksToProcess.forEach(click => {
                addFloatingText(`+${memoizedFormatNumber(clickPower)}`, click.x, click.y, '#ffffff');
            });
        }
        
        setGameState(prev => {
            let currentState = { ...prev };
            const newlyUnlockedAchievements: Achievement[] = [];
            
            // --- 1. Handle Clicks (Manual) ---
            if (clicksToProcess.length > 0) {
                const newTotalClicks = currentState.totalClicks + clicksToProcess.length;
                let achState = currentState.achievements;
                const check = (name: string, cond: boolean) => {
                    const { updatedAchievements, unlocked } = checkAndUnlockAchievement(achState, name, cond);
                    achState = updatedAchievements;
                    if (unlocked) newlyUnlockedAchievements.push(unlocked);
                };
                check(ACHIEVEMENT_IDS.CLICK_FRENZY, newTotalClicks >= 1000);
                check(ACHIEVEMENT_IDS.CLICK_STORM, newTotalClicks >= 100000);
                if (currentState.totalClicks === 0) check(ACHIEVEMENT_IDS.INITIAL_SPARK, true);
                currentState.achievements = achState;
                currentState.totalClicks = newTotalClicks;
            }

            // --- 2. Handle Core Discharge State ---
            if (currentState.isCoreDischarging && currentState.coreDischargeEndTimestamp && Date.now() >= currentState.coreDischargeEndTimestamp) {
                currentState.isCoreDischarging = false;
                currentState.coreDischargeEndTimestamp = null;
            }
            
            // --- 3. Calculate Production ---
            const ascensionBonuses = calculateAscensionBonuses(currentState.purchasedAscensionUpgrades);
            const achievementBonuses = calculateAchievementBonuses(currentState.achievements);
            const coreBonuses = calculateCoreBonuses(currentState);
            
            const production = calculateProduction(currentState, ascensionBonuses, achievementBonuses, coreBonuses);
            const productionThisFrame = production.productionTotal * (deltaTime / 1000);
            
            let energyFromProduction = productionThisFrame;
            
            // --- 4. Handle Bank Logic (Loan Repayment, Interest) ---
            const { newLoan, wasLoanRepaid } = bankState.handleLoanRepayment(currentState.currentLoan, productionThisFrame);
            if (wasLoanRepaid) onLoanRepaid();
            if (newLoan) {
                energyFromProduction -= (productionThisFrame * LOAN_REPAYMENT_RATE);
            }
            const { bankBonuses } = bankState.getComputed(currentState);
            const newSavingsBalance = currentState.savingsBalance + (currentState.savingsBalance * bankBonuses.savingsInterest * (deltaTime / 1000));
            
            // --- 5. Tally Energy ---
            const energyFromClicks = clicksToProcess.length * computed.clickPower;
            const newTotalEnergyProduced = currentState.totalEnergyProduced + productionThisFrame + energyFromClicks;
            const newEnergy = Math.min(
                currentState.energy + energyFromProduction + energyFromClicks,
                prestigeState.getComputed(currentState).maxEnergy
            );
            
            // Show production rate as floating text once per second
            productionTextTickCounter.current++;

            if (productionTextTickCounter.current >= 10) { // 10 ticks * 100ms = 1s
                if (production.productionTotal > 0 && settings.showFloatingText) {
                    const energyBar = document.getElementById('energy-bar-container');
                    if (energyBar) {
                        const rect = energyBar.getBoundingClientRect();
                        // Display the production per second rate, not the accumulated value for the last second.
                        const text = `+${memoizedFormatNumber(production.productionTotal)}`;
                        addFloatingText(text, rect.left + rect.width / 2, rect.top, '#ffdd00');
                    }
                }
                productionTextTickCounter.current = 0;
            }
            
            // --- 6. Handle Core Charge ---
            const chargeRatePerSecond = CORE_CHARGE_RATE * coreBonuses.chargeRate * achievementBonuses.coreCharge;
            let newCoreCharge = currentState.coreCharge;
            if (currentState.isCoreUnlocked && !currentState.isCoreDischarging && newCoreCharge < 100) {
                newCoreCharge = Math.min(100, newCoreCharge + (chargeRatePerSecond * (deltaTime / 1000)));
            }
            
            // --- 7. Update History & Unlock Checks ---
            let newProductionHistory = [...currentState.productionHistory, { value: productionThisFrame, duration: deltaTime }];
            let totalDuration = newProductionHistory.reduce((sum, p) => sum + p.duration, 0);
            while (totalDuration > 10000 && newProductionHistory.length > 1) {
                totalDuration -= newProductionHistory.shift()!.duration;
            }

            if (newEnergy >= SHOP_UNLOCK_TOTAL_ENERGY && !currentState.isShopUnlocked) {
                currentState.isShopUnlocked = true;
                currentState.hasUnseenShopItems = true;
            }
            if (newEnergy >= CORE_UNLOCK_TOTAL_ENERGY && !currentState.isCoreUnlocked) {
                currentState.isCoreUnlocked = true;
                newCoreCharge = 0;
            }
             if (newEnergy >= BANK_UNLOCK_TOTAL_ENERGY && !currentState.isBankDiscovered) {
                currentState.isBankDiscovered = true;
            }
            
            // --- 8. Finalize State ---
            if (newlyUnlockedAchievements.length > 0) {
                setTimeout(() => newlyUnlockedAchievements.forEach(onAchievementUnlock), 0);
            }

            return { 
                ...currentState, 
                energy: newEnergy, 
                coreCharge: newCoreCharge, 
                totalEnergyProduced: newTotalEnergyProduced, 
                savingsBalance: newSavingsBalance, 
                currentLoan: newLoan, 
                productionHistory: newProductionHistory 
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