
import React from 'react';
import { Settings, Notification, Achievement } from '../../types';
import { useGameState } from '../useGameState';
import { usePopupManager } from '../usePopupManager';

// Import des nouveaux hooks spécialisés
import { useFlowHandlers } from './app/useFlowHandlers';
import { useLocalSaveHandlers } from './app/useLocalSaveHandlers';
import { useCloudHandlers } from './app/useCloudHandlers';

type AppHandlersProps = {
    hasSaveData: boolean;
    actions: ReturnType<typeof useGameState>['actions'];
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    unlockAudio: () => void;
    setCloudStatus: React.Dispatch<React.SetStateAction<'none' | 'connected' | 'offline'>>;
};

export const useAppHandlers = (props: AppHandlersProps) => {
    
    // 1. Handlers de flux (Navigation, Confirmations)
    const flowHandlers = useFlowHandlers({
        hasSaveData: props.hasSaveData,
        actions: props.actions,
        popups: props.popups,
        playSfx: props.playSfx,
        addMessage: props.addMessage,
        setAppState: props.setAppState,
        setSettings: props.setSettings,
        unlockAudio: props.unlockAudio
    });

    // 2. Handlers de sauvegarde locale (Import/Export)
    const localSaveHandlers = useLocalSaveHandlers({
        actions: props.actions,
        playSfx: props.playSfx,
        addMessage: props.addMessage,
        setAppState: props.setAppState
    });

    // 3. Handlers Cloud (API, Google Sheets)
    const cloudHandlers = useCloudHandlers({
        actions: props.actions,
        popups: props.popups,
        playSfx: props.playSfx,
        addMessage: props.addMessage,
        setAppState: props.setAppState,
        setCloudStatus: props.setCloudStatus
    });

    // Agrégation et exposition
    return {
        ...flowHandlers,
        ...localSaveHandlers,
        ...cloudHandlers
    };
};
