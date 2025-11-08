import { useRef, useCallback } from 'react';
import { sfx } from '../audio/sfx';

export const useSfx = (volume: number) => {
    const audioUnlocked = useRef(false);

    const unlockAudio = useCallback(() => {
        if (audioUnlocked.current) return;
        // A small, silent audio play to unlock the AudioContext
        const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAJAgEAAg==");
        silentAudio.volume = 0;
        silentAudio.play().then(() => {
            audioUnlocked.current = true;
        }).catch(() => {});
    }, []);

    const playSfx = useCallback((sound: keyof typeof sfx) => {
        if (sound === 'ui_hover' && !audioUnlocked.current) {
            return;
        }

        if (volume > 0) {
            const audio = sfx[sound];
            audio.currentTime = 0;
            audio.volume = volume;
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (error.name !== 'NotAllowedError') {
                        console.error(`SFX '${sound}' play failed:`, error);
                    }
                });
            }
        }
    }, [volume]);

    return { playSfx, unlockAudio };
};
