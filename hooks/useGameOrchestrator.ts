
// hooks/useGameOrchestrator.ts
import React, { useEffect } from 'react';
import { Achievement, GameState, Notification, Settings } from '../types';
import { useGameLoop } from './useGameLoop';
import { useTutorialTriggers } from './useTutorialTriggers';
import { usePopupManager } from './usePopupManager';
import { useGameState } from './useGameState';

// Systems
import { useAutoSave } from './systems/useAutoSave';
import { usePlayTime } from './systems/usePlayTime';
import { useProgressionEvents } from './systems/useProgressionEvents';

type GameOrchestratorProps = {
    appState: string;
    loadStatus: string;
    gameState: GameState;
    computed: ReturnType<typeof useGameState>['computed'];
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    prestigeState: ReturnType<typeof useGameState>['prestigeState'];
    coreMechanics: ReturnType<typeof useGameState>['coreMechanics'];
    bankState: ReturnType<typeof useGameState>['bankState'];
    achievementsManager: ReturnType<typeof useGameState>['achievementsManager'];
    saveGameState: (settings: Settings) => void;
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    memoizedFormatNumber: (num: number) => string;
    onAchievementUnlock: (achievement: Achievement) => void;
    clickQueue: React.MutableRefObject<{x: number, y: number}[]>;
};

export const useGameOrchestrator = ({
    appState,
    loadStatus,
    gameState,
    computed,
    setGameState,
    prestigeState,
    coreMechanics,
    bankState,
    achievementsManager,
    saveGameState,
    settings,
    popups,
    addMessage,
    addFloatingText,
    memoizedFormatNumber,
    onAchievementUnlock,
    clickQueue,
}: GameOrchestratorProps) => {

    const onLoanRepaid = React.useCallback(() => {
        addMessage("Votre prêt a été entièrement remboursé !", 'info', { title: "Prêt Remboursé" });
    }, [addMessage]);
    
    // --- 1. Main Game Loop (High Frequency) ---
    useGameLoop(
        appState,
        loadStatus,
        setGameState,
        clickQueue,
        prestigeState,
        coreMechanics,
        bankState,
        onLoanRepaid,
        addFloatingText,
        memoizedFormatNumber,
        settings,
        computed,
        onAchievementUnlock
    );
    
    // --- 2. Achievement Checking (Sync with Loop) ---
    useEffect(() => {
        if (appState === 'game') {
            achievementsManager.checkAll(gameState, computed.productionTotal, computed.maxEnergy);
        }
    }, [gameState, computed.productionTotal, computed.maxEnergy, appState, achievementsManager]);
    
    // --- 3. Feature Triggers & Tutorials ---
    // Triggers for Ascension & Bank discovery
    useTutorialTriggers(
        gameState,
        prestigeState,
        setGameState,
        () => popups.setShowAscensionTutorial(true),
        () => popups.setShowBankTutorial(true)
    );

    // Triggers for Shop, Core, Loan Tiers, and Step-based tutorial
    useProgressionEvents({
        gameState,
        setGameState,
        popups,
        coreMechanics,
        addMessage
    });

    // --- 4. Background Systems ---
    useAutoSave({ appState, saveGameState, settings, addMessage });
    usePlayTime({ appState, setGameState });
};
