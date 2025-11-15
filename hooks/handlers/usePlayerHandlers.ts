import React from 'react';
import { GameState, Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';
import { PARTICLE_COLORS } from '../../constants';
import { calculateBulkBuy, calculateCost } from '../../utils/helpers';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

type PlayerHandlersProps = {
    gameState: GameState;
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy') => void;
    addParticle: (x: number, y: number, color: string) => void;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    memoizedFormatNumber: (num: number) => string;
};

export const usePlayerHandlers = ({
    gameState,
    computed,
    actions,
    popups,
    playSfx,
    addParticle,
    addMessage,
}: PlayerHandlersProps) => {

    const onBuyUpgrade = (index: number, amount: number | 'MAX') => {
        const upgrade = gameState.upgrades[index];
        const { costMultiplier } = computed;
        // FIX: Destructure `numLevelsBought` from `calculateBulkBuy` as `numToBuy` does not exist on the return type.
        const { numLevelsBought } = calculateBulkBuy(upgrade, amount, gameState.energy, costMultiplier);

        if (numLevelsBought > 0) {
            actions.buyUpgrade(index, amount);
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            actions.unlockAchievement(ACHIEVEMENT_IDS.FIRST_INVESTMENT);
            if (popups.tutorialStep === 4 && upgrade.id === 'gen_1') {
                popups.setTutorialStep(5);
            }
        } else {
            addMessage("Pas assez d'énergie !", 'error');
        }
    };
    
    const onBuyTierUpgrade = (index: number) => {
        const upgrade = gameState.upgrades[index];
        const { costMultiplier } = computed;
        const tierUpgradeCost = calculateCost(upgrade.baseCost, upgrade.owned, costMultiplier) * 10;
        
        if (gameState.energy >= tierUpgradeCost) {
            actions.buyTierUpgrade(index);
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, '#ffdd00'); // Gold particle for tier
            addMessage(`${upgrade.name} a atteint un nouveau seuil !`, 'info', { title: 'Seuil Amélioré !' });
        } else {
            addMessage("Pas assez d'énergie pour l'amélioration de seuil.", 'error');
        }
    };


    return {
        onBuyUpgrade,
        onBuyTierUpgrade,
        markCategoryAsViewed: actions.markCategoryAsViewed,
    };
};