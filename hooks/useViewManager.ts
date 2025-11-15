// hooks/useViewManager.ts
import React, { useState } from 'react';
import { GameState, QuantumPathType, Notification, Achievement } from '../types';
import { useGameState } from './useGameState';
import { usePopupManager } from './usePopupManager';
import { QUANTUM_PATHS } from '../data/quantumPaths';

type ViewManagerProps = {
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    gameState: GameState;
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
};

export const useViewManager = ({
    playSfx,
    gameState,
    actions,
    popups,
    addMessage,
}: ViewManagerProps) => {
    const [activeView, setActiveView] = useState<'main' | 'quantum_core' | 'quantum_path' | 'shop'>('main');
    const [pathChoiceToConfirm, setPathChoiceToConfirm] = useState<QuantumPathType | null>(null);

    const enterQuantumInterface = (e: React.PointerEvent) => {
        e.preventDefault();
        playSfx('ui_hover');
        actions.markQuantumCoreAsInteracted();
        if (gameState.chosenQuantumPath) {
            setActiveView('quantum_path');
        } else {
            setActiveView('quantum_core');
        }
    };

    const exitQuantumInterface = () => {
        playSfx('click');
        setActiveView('main');
    };
    
    const enterShopInterface = () => {
        playSfx('ui_hover');
        if (gameState.hasUnseenShopItems) {
            actions.markShopItemsAsSeen();
        }
        setActiveView('shop');
    };

    const exitShopInterface = () => {
        playSfx('click');
        setActiveView('main');
    };

    const onChooseQuantumPath = (path: QuantumPathType) => {
        playSfx('click');
        setPathChoiceToConfirm(path);
        popups.setShowQuantumPathConfirm(true);
    };

    const onConfirmQuantumPath = () => {
        if (pathChoiceToConfirm) {
            actions.setQuantumPath(pathChoiceToConfirm);
            playSfx('buy');
            addMessage(`Voie du ${QUANTUM_PATHS[pathChoiceToConfirm].name} choisie !`, 'info');
            popups.setShowQuantumPathConfirm(false);
            setPathChoiceToConfirm(null);
            setActiveView('quantum_path');
        }
    };
    
    const onPurchasePathUpgrade = () => {
        if (actions.purchasePathUpgrade()) {
            playSfx('buy');
            addMessage("Progression de voie acquise !", 'info');
        } else {
            addMessage("Pas assez de Fragments Quantiques !", 'error');
        }
    };

    const onBuyCoreUpgrade = (id: string) => {
        if (actions.buyCoreUpgrade(id)) {
            playSfx('buy');
            addMessage("Calibration du cœur acquise !", 'info');
        } else {
            addMessage("Pas assez de Fragments Quantiques ou prérequis non remplis !", 'error');
        }
    };

    const onResetQuantumPath = () => {
        playSfx('click');
        popups.setShowQuantumPathResetConfirm(true);
    };

    const onConfirmResetQuantumPath = () => {
        actions.resetQuantumPath();
        playSfx('buy');
        addMessage("Voie quantique réinitialisée. Vos fragments ont été remboursés.", 'info', { title: "Réinitialisation Complète" });
        popups.setShowQuantumPathResetConfirm(false);
        setActiveView('quantum_core'); // Switch to path selection view
    };

    return {
        activeView,
        pathChoiceToConfirm,
        viewHandlers: {
            enterQuantumInterface,
            exitQuantumInterface,
            enterShopInterface,
            exitShopInterface,
            onChooseQuantumPath,
            onConfirmQuantumPath,
            onPurchasePathUpgrade,
            onBuyCoreUpgrade,
            onResetQuantumPath,
            onConfirmResetQuantumPath,
        },
    };
};