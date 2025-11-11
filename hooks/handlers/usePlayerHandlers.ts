import React from 'react';
import { GameState, Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';
import { PARTICLE_COLORS } from '../../constants';
import { calculateBulkBuy, formatNumber } from '../../utils/helpers';

type PlayerHandlersProps = {
    gameState: GameState;
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy') => void;
    addParticle: (x: number, y: number, color: string) => void;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
};

export const usePlayerHandlers = ({
    gameState,
    computed,
    actions,
    settings,
    popups,
    playSfx,
    addParticle,
    addFloatingText,
    addNotification,
}: PlayerHandlersProps) => {

    const onCollect = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
        e.preventDefault();
        playSfx('click');
        const clickPower = computed.clickPower;
        actions.incrementClickCount(clickPower);
        
        let x: number, y: number;
        if ('touches' in e) { // TouchEvent
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else { // MouseEvent
            x = e.clientX;
            y = e.clientY;
        }

        addParticle(x, y, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${formatNumber(clickPower, settings.scientificNotation)}`, x, y, '#ffffff');
        actions.unlockAchievement("Étincelle Initiale");

        if (popups.tutorialStep === 1) {
            popups.setTutorialStep(2);
        }
    };

    const onBuyUpgrade = (index: number, amount: number | 'MAX') => {
        const upgrade = gameState.upgrades[index];
        const { costMultiplier } = computed;
        const { numToBuy } = calculateBulkBuy(upgrade, amount, gameState.energy, costMultiplier);

        if (numToBuy > 0) {
            actions.buyUpgrade(index, amount);
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            actions.unlockAchievement("Premier Investissement");
            if (popups.tutorialStep === 4 && upgrade.id === 'gen_1') {
                popups.setTutorialStep(5);
            }
        } else {
            addNotification("Pas assez d'énergie !", 'error');
        }
    };

    return {
        onCollect,
        onBuyUpgrade,
        markCategoryAsViewed: actions.markCategoryAsViewed,
    };
};