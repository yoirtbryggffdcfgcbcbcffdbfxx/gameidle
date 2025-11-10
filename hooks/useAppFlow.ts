import { useState, useEffect, useRef } from 'react';

type LoadStatus = 'loading' | 'no_save' | 'has_save';
type AppState = 'loading' | 'menu' | 'game' | 'cinematic';

export const useAppFlow = (loadStatus: LoadStatus) => {
    const [appState, setAppState] = useState<AppState>('loading');
    const transitionedToMenu = useRef(false);
    
    const hasSaveData = loadStatus === 'has_save';

    useEffect(() => {
        if (loadStatus !== 'loading' && !transitionedToMenu.current) {
            transitionedToMenu.current = true;
            // Introduce a minimum display time for the loading screen animation.
            const timer = setTimeout(() => {
                setAppState('menu');
            }, 1500); // 1.5 seconds to allow animation to complete.

            return () => clearTimeout(timer);
        }
    }, [loadStatus, setAppState]);

    return {
        appState,
        setAppState,
        hasSaveData,
    };
};
