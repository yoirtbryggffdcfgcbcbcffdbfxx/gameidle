import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';
import { SAVE_KEY } from '../constants';

type AppState = 'loading' | 'menu' | 'game' | 'cinematic';

const initialSettings: Settings = { 
    visualEffects: true,
    showFloatingText: true,
    animSpeed: 2,
    scientificNotation: false,
    theme: 'dark',
    sfxVolume: 0.5,
    confirmAscension: true,
};

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>(initialSettings);
    const [appState, setAppState] = useState<AppState>('loading');

    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                const data = JSON.parse(savedGame);
                if (data.settings) {
                    setSettings(s => ({ ...s, ...data.settings }));
                }
            }
        } catch (e) {
            console.error("Failed to load settings:", e);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);
    
    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
        setSettings(s => ({...s, ...newSettings}));
    }, []);

    return { settings, setSettings, handleSettingsChange, appState, setAppState };
};