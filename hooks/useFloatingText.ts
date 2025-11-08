import { useState, useCallback, useRef } from 'react';
import { FloatingText } from '../types';

export const useFloatingText = (floatingTextEnabled: boolean) => {
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
    const textIdCounter = useRef(0);

    const addFloatingText = useCallback((text: string, x: number, y: number, color: string) => {
        if (!floatingTextEnabled) return;

        const newText: FloatingText = {
            id: textIdCounter.current++,
            text,
            x,
            y,
            color,
        };
        setFloatingTexts(prev => [...prev, newText]);
    }, [floatingTextEnabled]);

    const removeFloatingText = useCallback((id: number) => {
        setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { floatingTexts, addFloatingText, removeFloatingText };
};