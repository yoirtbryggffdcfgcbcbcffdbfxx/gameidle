
// hooks/useGameEngine.ts
import React, { useMemo, useCallback, useRef, useState } from 'react';
import { Achievement, Notification } from '../types';

// Hooks d'état et de logique
import { useGameState } from './useGameState';
import { useSettings } from './useSettings';
import { useAppFlow } from './useAppFlow';
import { useGameOrchestrator } from './useGameOrchestrator';
import { useViewManager } from './useViewManager';

// Handlers (couche d'actions avec effets secondaires)
import { useAppHandlers } from './handlers/useAppHandlers';
import { usePlayerHandlers } from './handlers/usePlayerHandlers';
import { usePrestigeHandlers } from './handlers/usePrestigeHandlers';
import { useBankHandlers } from './handlers/useBankHandlers';
import { useShopHandlers } from './handlers/useShopHandlers';

// UI & Effets
import { useUIEffects } from './ui/useUIEffects';
import { useGlobalShortcuts } from './ui/useGlobalShortcuts';
import { formatNumber } from '../utils/helpers';
import { SAVE_KEY } from '../constants';

export const useGameEngine = () => {
    // --- 1. Hooks Fondamentaux ---
    const { settings, setSettings, handleSettingsChange } = useSettings();
    const { playSfx, unlockAudio, ...uiEffects } = useUIEffects(settings);

    // Fix: Use useState to properly initialize loadStatus
    const [loadStatus, setLoadStatus] = useState<'loading' | 'no_save' | 'has_save'>('loading');

    // Check localStorage on mount
    React.useEffect(() => {
        const savedData = localStorage.getItem(SAVE_KEY);
        setLoadStatus(savedData ? 'has_save' : 'no_save');
    }, []);

    const { appState, setAppState, hasSaveData } = useAppFlow(loadStatus);

    // Nouvel état pour le suivi Cloud
    const [cloudStatus, setCloudStatus] = useState<'none' | 'connected' | 'offline'>('none');

    // --- 2. Hook d'État Principal ---
    const addMessageToState = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        // This function will be replaced by the one from useGameState,
        // but we need a stable reference for the initial render pass.
    }, []);
    const addMessageRef = React.useRef(addMessageToState);

    const handleAchievementUnlock = React.useCallback((achievement: Achievement) => {
        addMessageRef.current(achievement.name, 'achievement', {
            title: 'Succès Débloqué !',
            achievement,
        });
    }, []);

    const {
        gameState, setGameState, computed, actions, dev, saveGameState,
        achievementsManager, prestigeState, coreMechanics, bankState
    } = useGameState(handleAchievementUnlock, appState, loadStatus);

    // Update the ref with the real function once it's available
    addMessageRef.current = actions.addMessage;
    const addMessage = actions.addMessage;

    // --- 3. Hooks de Logique Spécialisée (Refactorisés) ---
    const { activeView, pathChoiceToConfirm, viewHandlers } = useViewManager({
        playSfx,
        gameState,
        actions,
        popups: uiEffects.popups,
        addMessage,
    });

    const clickQueue = React.useRef<{ x: number, y: number }[]>([]);

    const onCollect = React.useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
        e.preventDefault();
        playSfx('click');
        clickQueue.current.push({ x: e.clientX, y: e.clientY });

        // Handle tutorial progression here, as it's a direct UI interaction feedback
        if (uiEffects.popups.tutorialStep === 1) {
            uiEffects.popups.setTutorialStep(2);
        }
    }, [playSfx, uiEffects.popups]);

    const memoizedFormatNumber = React.useCallback((num: number) => {
        // Use strictly the user setting. The helper function now handles infinite suffixes (aa, ab...)
        // so we don't need to force scientific notation for large numbers anymore.
        return formatNumber(num, settings.scientificNotation);
    }, [settings.scientificNotation]);

    useGameOrchestrator({
        appState, loadStatus, gameState, computed,
        setGameState, prestigeState, coreMechanics, bankState, achievementsManager,
        saveGameState, settings,
        popups: uiEffects.popups,
        addMessage,
        addFloatingText: uiEffects.addFloatingText,
        memoizedFormatNumber,
        onAchievementUnlock: handleAchievementUnlock,
        clickQueue,
    });

    // --- 4. Handlers d'Action ---
    const appHandlers = useAppHandlers({
        hasSaveData,
        actions,
        popups: uiEffects.popups,
        playSfx,
        addMessage,
        setAppState,
        setSettings,
        unlockAudio,
        setCloudStatus // Passage du setter
    });
    const playerHandlers = usePlayerHandlers({ gameState, computed, actions, settings, popups: uiEffects.popups, playSfx, ...uiEffects, addMessage, memoizedFormatNumber });
    const prestigeHandlers = usePrestigeHandlers({ gameState, computed, actions, coreActions: actions, settings, popups: uiEffects.popups, playSfx, ...uiEffects, addMessage });
    const bankHandlers = useBankHandlers({ gameState, computed, actions, playSfx, addMessage, memoizedFormatNumber });
    const shopHandlers = useShopHandlers({ gameState, actions, playSfx, addMessage });

    // --- 5. Raccourcis Globaux ---
    // Utilisation du hook dédié pour gérer les raccourcis clavier ('C', 'D')
    useGlobalShortcuts(uiEffects.popups, actions);

    const unreadMessageCount = useMemo(() => gameState.messageLog.filter(m => !m.read).length, [gameState.messageLog]);

    // --- 6. Construction des Objets de Contexte (Optimisation) ---
    // Nous séparons Data (ce qui change souvent) et Actions (ce qui est stable ou fonctionnel)

    const { popups, ...otherUiEffects } = uiEffects;

    // Objet DATA : Contient tout l'état réactif
    // Il sera passé au GameDataContext
    const gameData = {
        appState,
        hasSaveData,
        gameState,
        computedState: { ...computed, unreadMessageCount },
        uiState: { settings, activeView, pathChoiceToConfirm, ...otherUiEffects, ...popups, cloudStatus },
        popups: popups, // Popups contient aussi du state (show...), donc on le garde dans Data
    };

    // Objet ACTIONS : Contient toutes les fonctions
    // Il sera passé au GameActionContext
    const gameActions = {
        handlers: {
            ...appHandlers,
            ...playerHandlers,
            ...prestigeHandlers,
            ...bankHandlers,
            ...shopHandlers,
            ...viewHandlers,
            onCollect,
            onSettingsChange: handleSettingsChange,
            markShopItemsAsSeen: actions.markShopItemsAsSeen,
            onBuyTierUpgrade: playerHandlers.onBuyTierUpgrade,
            addMessage,
            markAllMessagesAsRead: actions.markAllMessagesAsRead,
            dev,
        },
        playSfx,
        removeParticle: otherUiEffects.removeParticle,
        removeFloatingText: otherUiEffects.removeFloatingText,
        memoizedFormatNumber,
        addMessage,
        markAllMessagesAsRead: actions.markAllMessagesAsRead,
        dev,
    };

    return {
        gameData,
        gameActions,
        // Rétrocompatibilité : On retourne aussi tout à plat pour l'instant si nécessaire,
        // mais App.tsx utilisera gameData et gameActions.
        ...gameData,
        ...gameActions
    };
};
