// hooks/useGameOrchestrator.ts
import React, { useEffect } from 'react';
import { Achievement, GameState, Notification, Settings } from '../types';
import { useGameState } from './useGameState';
import { useGameLoop } from './useGameLoop';
import { useTutorialTriggers } from './useTutorialTriggers';
import { usePopupManager } from '../usePopupManager';

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
    
    // --- Game Loop & Event Triggers ---
    // FIX: Removed `clickQueueRef` from the arguments passed to `useGameLoop` to match its definition.
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
    
    useEffect(() => {
        if (appState === 'game') {
            achievementsManager.checkAll(gameState, computed.productionTotal, computed.maxEnergy);
        }
    }, [gameState, computed.productionTotal, computed.maxEnergy, appState, achievementsManager]);
    
    useTutorialTriggers(
        gameState,
        prestigeState,
        setGameState,
        () => popups.setShowAscensionTutorial(true),
        () => popups.setShowBankTutorial(true)
    );

    // Trigger popups based on state changes from the game loop
    useEffect(() => {
        if (gameState.isShopUnlocked && !gameState.hasSeenBankTutorial) { // Assuming shop is a pre-req for bank tutorial trigger
            popups.setShowShopTutorial(true);
        }
    }, [gameState.isShopUnlocked, gameState.hasSeenBankTutorial, popups.setShowShopTutorial]);

    useEffect(() => {
        if (gameState.isCoreUnlocked && !gameState.hasSeenCoreTutorial) {
            popups.setShowCoreTutorial(true);
            coreMechanics.actions.setHasSeenCoreTutorial(true);
        }
    }, [gameState.isCoreUnlocked, gameState.hasSeenCoreTutorial, popups.setShowCoreTutorial, coreMechanics.actions]);

    // Auto-advance tutorial logic
    useEffect(() => {
        if (popups.tutorialStep === 2 && gameState.energy >= 15) {
            popups.setTutorialStep(3);
        }
    }, [gameState.energy, popups.tutorialStep, popups.setTutorialStep]);
    
    // Loan Tier Progression
    useEffect(() => {
        const { totalEnergyProduced, loanTier } = gameState;
        let newTier = loanTier;

        // Check from highest to lowest to prevent incorrect assignments
        if (totalEnergyProduced >= 1e12 && loanTier < 2) {
            newTier = 2;
        } else if (totalEnergyProduced >= 1e9 && loanTier < 1) {
            newTier = 1;
        }

        if (newTier !== loanTier) {
            setGameState(prev => ({ ...prev, loanTier: newTier }));
            addMessage(`Nouveaux montants de prêt disponibles à la banque !`, 'info', { title: 'Finance Améliorée' });
        }
    }, [gameState.totalEnergyProduced, gameState.loanTier, setGameState, addMessage]);

    // --- Auto-save Logic ---
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (appState === 'game') {
                saveGameState(settings);
                addMessage("Progression sauvegardée.", 'info', { title: 'Sauvegarde auto' });
            }
        }, 60000); // Save every 60 seconds
        return () => clearInterval(autoSaveInterval);
    }, [appState, saveGameState, settings, addMessage]);

    // --- Play Time Tracker ---
    useEffect(() => {
        const timer = setInterval(() => {
            if (appState === 'game') {
                setGameState(prev => ({ ...prev, timePlayedInSeconds: prev.timePlayedInSeconds + 1 }));
            }
        }, 1000); // Increment every second

        return () => clearInterval(timer);
    }, [appState, setGameState]);
};