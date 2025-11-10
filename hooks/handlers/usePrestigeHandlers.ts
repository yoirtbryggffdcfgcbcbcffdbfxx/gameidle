import React from 'react';
import { GameState, Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';

type PrestigeHandlersProps = {
    gameState: GameState;
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'buy' | 'click') => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setShowCoreTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

export const usePrestigeHandlers = ({
    gameState,
    computed,
    actions,
    settings,
    popups,
    playSfx,
    addNotification,
    setShowCoreTutorial,
}: PrestigeHandlersProps) => {

    const onConfirmAscension = () => {
        if (actions.doAscension()) {
            actions.unlockAchievement("Au-delà du Voile");
            addNotification(`Ascension effectuée ! Vous gagnez ${computed.ascensionGain} point et ${computed.ascensionGain} Fragment.`, 'info', { title: "Ascension !" });
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
    
    const onDischargeCore = () => {
        if (actions.dischargeCore()) {
            playSfx('buy'); // Use a powerful sound
            if (!gameState.hasSeenCoreTutorial) {
                setShowCoreTutorial(true);
                actions.setHasSeenCoreTutorial(true);
            } else {
                addNotification(`Cœur quantique activé ! Production x${computed.coreBonuses.multiplier.toFixed(1)} pendant 10s !`, 'info', { title: 'SURCHARGE !'});
            }
            actions.unlockAchievement("Surcharge Quantique");
        }
    };

    const onBuyAscensionUpgrade = (id: string) => {
        if (actions.buyAscensionUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration d'ascension achetée !", 'info');
        } else {
            addNotification("Pas assez de points d'ascension !", 'error');
        }
    };

    const onBuyCoreUpgrade = (id: string) => {
        if (actions.buyCoreUpgrade(id)) {
            playSfx('buy');
            addNotification("Réacteur du cœur amélioré !", 'info');
        } else {
            addNotification("Pas assez de fragments quantiques !", 'error');
        }
    };

    return {
        onAscend,
        onConfirmAscension,
        onDischargeCore,
        onBuyAscensionUpgrade,
        onBuyCoreUpgrade,
    };
};
