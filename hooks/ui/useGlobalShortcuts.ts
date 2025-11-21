
import { useEffect, useRef } from 'react';
import { ACHIEVEMENT_IDS } from '../../constants/achievements';
import { usePopupManager } from '../usePopupManager';
import { useGameState } from '../useGameState';

export const useGlobalShortcuts = (
    popups: ReturnType<typeof usePopupManager>,
    actions: ReturnType<typeof useGameState>['actions']
) => {
    const popupsRef = useRef(popups);
    const actionsRef = useRef(actions);

    // Update refs on every render to ensure we have the latest state/functions
    popupsRef.current = popups;
    actionsRef.current = actions;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            // Allow shortcuts even if a button has focus, only block for text inputs
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            // 'D' for Dev Panel
            if (e.key.toLowerCase() === 'd') {
                e.preventDefault();
                popupsRef.current.setShowDevPanel(prev => {
                    const newState = !prev;
                    if (newState) {
                        actionsRef.current.unlockAchievement(ACHIEVEMENT_IDS.HONORARY_DEVELOPER);
                    }
                    return newState;
                });
            }

            // 'C' for Force Cursor
            if (e.key.toLowerCase() === 'c') {
                e.preventDefault();
                
                // DIRECT DOM MANIPULATION: Ensure immediate feedback
                // This bypasses any potential React state update lag or context propagation issues
                const isForced = document.body.classList.toggle('force-show-cursor');
                
                // Sync React state to match the DOM
                popupsRef.current.setForceShowCursor(isForced);
                
                // Show feedback toast
                actionsRef.current.addMessage(
                    isForced ? "Curseur personnalisé : ACTIVÉ" : "Curseur personnalisé : DÉSACTIVÉ",
                    'info'
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};