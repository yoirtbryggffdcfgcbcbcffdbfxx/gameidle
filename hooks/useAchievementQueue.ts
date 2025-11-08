import { useState, useEffect, useCallback } from 'react';
import { Achievement } from '../types';

// La durée de l'animation de sortie du toast (doit correspondre au CSS)
const HIDE_ANIMATION_DURATION = 300;

export const useAchievementQueue = (duration: number = 1000) => {
    const [queue, setQueue] = useState<Achievement[]>([]);
    const [currentAchievementToast, setCurrentAchievementToast] = useState<Achievement | null>(null);
    const [isDisplaying, setIsDisplaying] = useState(false);

    const queueAchievement = useCallback((achievement: Achievement) => {
        // Évite d'ajouter des doublons à la file d'attente
        setQueue(prev => prev.find(a => a.name === achievement.name) ? prev : [...prev, achievement]);
    }, []);

    useEffect(() => {
        // Utilisation de variables pour les IDs de timer pour un nettoyage correct
        let displayTimer: number;
        let unlockTimer: number;

        if (queue.length > 0 && !isDisplaying) {
            setIsDisplaying(true); // Verrouille la file d'attente pour éviter les superpositions

            const nextAchievement = queue[0];
            setCurrentAchievementToast(nextAchievement);
            setQueue(prev => prev.slice(1));

            // Timer pour cacher la notification actuelle après sa durée d'affichage
            displayTimer = window.setTimeout(() => {
                setCurrentAchievementToast(null); // Déclenche l'animation de sortie

                // Timer pour déverrouiller la file d'attente APRÈS la fin de l'animation de sortie
                unlockTimer = window.setTimeout(() => {
                    setIsDisplaying(false);
                }, HIDE_ANIMATION_DURATION);

            }, duration);
        }

        // Fonction de nettoyage pour effacer les timers si le composant est démonté
        return () => {
            clearTimeout(displayTimer);
            clearTimeout(unlockTimer);
        };
    }, [queue, isDisplaying, duration]);

    return { currentAchievementToast, queueAchievement };
};