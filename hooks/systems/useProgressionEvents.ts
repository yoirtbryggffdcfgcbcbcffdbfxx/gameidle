
import React, { useEffect } from 'react';
import { GameState, Notification, Achievement } from '../../types';
import { INITIAL_UPGRADES } from '../../data/upgrades';
import { usePopupManager } from '../usePopupManager';
import { useCoreMechanics } from '../state/useCoreMechanics';

interface ProgressionEventsDeps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    popups: ReturnType<typeof usePopupManager>;
    coreMechanics: ReturnType<typeof useCoreMechanics>;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
}

export const useProgressionEvents = ({ 
    gameState, 
    setGameState, 
    popups, 
    coreMechanics, 
    addMessage 
}: ProgressionEventsDeps) => {
    
    // Trigger popups based on state changes
    useEffect(() => {
        if (gameState.isShopUnlocked && !gameState.hasSeenBankTutorial) {
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
        const firstUpgradeCost = INITIAL_UPGRADES.find(u => u.id === 'gen_1')?.baseCost || 15;
        
        if (popups.tutorialStep === 2 && gameState.energy >= firstUpgradeCost) {
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
};
