
import { useEffect } from 'react';
import { Settings, Notification, Achievement } from '../../types';

interface AutoSaveDeps {
    appState: string;
    saveGameState: (settings: Settings) => void;
    settings: Settings;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
}

export const useAutoSave = ({ appState, saveGameState, settings, addMessage }: AutoSaveDeps) => {
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (appState === 'game') {
                saveGameState(settings);
                addMessage("Progression sauvegardée.", 'info', { title: 'Sauvegarde auto' });
            }
        }, 60000); // Save every 60 seconds
        return () => clearInterval(autoSaveInterval);
    }, [appState, saveGameState, settings, addMessage]);
};
