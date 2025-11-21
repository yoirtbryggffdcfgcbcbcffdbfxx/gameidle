
import { useState, useCallback, useEffect } from 'react';
import { Settings } from '../types';
import { SAVE_KEY } from '../constants';

const initialSettings: Settings = { 
    visualEffects: true,
    showFloatingText: true,
    animSpeed: 2,
    scientificNotation: false,
    theme: 'dark',
    sfxVolume: 0.5,
    confirmAscension: true,
    // URL mise à jour avec votre script spécifique
    cloudApiUrl: 'https://script.google.com/macros/s/AKfycbxWwHScSbi7vbC1D-NxmnPIRhdLV0-XybifytgqeblokkgbRXCK8ypxLsyDkpjmplp8/exec',
    cloudUserId: '',
    cloudPassword: '',
};

export const useSettings = () => {
    // OPTIMISATION: Initialisation paresseuse (Lazy State).
    // Le chargement et le parsing JSON se font une seule fois au montage,
    // évitant un effet de "flash" ou de lag dû à un re-rendu inutile.
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                const data = JSON.parse(savedGame);
                if (data.settings) {
                    // Merge with initialSettings to ensure new keys exist
                    return { ...initialSettings, ...data.settings };
                }
            }
        } catch (e) {
            console.error("Failed to load settings:", e);
        }
        return initialSettings;
    });

    // Applique le thème immédiatement dès que les settings sont prêts
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);
    
    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
        setSettings(s => ({...s, ...newSettings}));
    }, []);

    return { settings, setSettings, handleSettingsChange };
};
