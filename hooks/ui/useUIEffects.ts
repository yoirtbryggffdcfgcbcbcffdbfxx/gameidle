import { useEffect } from 'react';
import { Settings } from '../../types';

// UI & Effects Hooks
import { useSfx } from '../useSfx';
import { useNotifications } from '../useNotifications';
import { useParticleSystem } from '../useParticleSystem';
import { useFloatingText } from '../useFloatingText';
import { usePopupManager } from '../usePopupManager';

export const useUIEffects = (settings: Settings) => {
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { notifications, addNotification, removeNotification } = useNotifications();
    const popups = usePopupManager();
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.showFloatingText);

    // GLOBAL EFFECT: Applique la classe pour forcer l'affichage du curseur
    // Déplacé ici pour fonctionner partout (Menu, Jeu, Cinématique)
    useEffect(() => {
        document.body.classList.toggle('force-show-cursor', popups.forceShowCursor);
    }, [popups.forceShowCursor]);

    return {
        // SFX
        playSfx,
        unlockAudio,
        // Notifications
        notifications,
        addNotification,
        removeNotification,
        // Popups
        popups,
        // Particles
        particles,
        addParticle,
        removeParticle,
        // Floating Text
        floatingTexts,
        addFloatingText,
        removeFloatingText,
    };
};