import React from 'react';
import { GameState, Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';
import { useCoreMechanics } from '../state/useCoreMechanics';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';

type PrestigeHandlersProps = {
    gameState: GameState;
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    coreActions: ReturnType<typeof useCoreMechanics>['actions'];
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'buy' | 'click') => void;
    addParticle: (x: number, y: number, color: string) => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
};

export const usePrestigeHandlers = ({
    gameState,
    computed,
    actions,
    coreActions,
    settings,
    popups,
    playSfx,
    addParticle,
    addMessage,
}: PrestigeHandlersProps) => {

    const onConfirmAscension = () => {
        if (actions.doAscension()) {
            actions.unlockAchievement(ACHIEVEMENT_IDS.BEYOND_THE_VEIL);
            addMessage(`Ascension effectuée ! Vous gagnez ${computed.ascensionGain} point et ${computed.ascensionGain} Fragment.`, 'info', { title: "Ascension !" });
        }
        popups.setShowAscensionConfirm(false);
    };
    
    const onAscend = () => {
        if (!computed.canAscend) return;
        playSfx('click');
        if (settings.confirmAscension) {
            popups.setShowAscensionConfirm(true);
        } else {
            onConfirmAscension();
        }
    };
    
    const onDischargeCore = (e: React.PointerEvent) => {
        e.preventDefault();
        if (coreActions.dischargeCore()) {
            const x = e.clientX;
            const y = e.clientY;
            addParticle(x, y, '#ff00c8'); // Magenta discharge particles

            playSfx('buy'); // Use a powerful sound
            if (!gameState.hasSeenCoreTutorial) {
                popups.setShowCoreTutorial(true);
                coreActions.setHasSeenCoreTutorial(true);
            } else {
                addMessage(`Cœur quantique activé ! Production x${computed.coreBonuses.multiplier.toFixed(1)} pendant 10s !`, 'info', { title: 'SURCHARGE !'});
            }
            actions.unlockAchievement(ACHIEVEMENT_IDS.QUANTUM_OVERLOAD);
        }
    };

    const onBuyAscensionUpgrade = (id: string) => {
        if (actions.buyAscensionUpgrade(id)) {
            playSfx('buy');
            addMessage("Amélioration d'ascension achetée !", 'info');
        } else {
            addMessage("Pas assez de points d'ascension !", 'error');
        }
    };

    return {
        onAscend,
        onConfirmAscension,
        onDischargeCore,
        onBuyAscensionUpgrade,
    };
};