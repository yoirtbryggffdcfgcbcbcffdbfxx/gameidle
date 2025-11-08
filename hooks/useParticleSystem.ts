import { useState, useCallback, useRef } from 'react';
import { Particle } from '../types';

export const useParticleSystem = (visualEffectsEnabled: boolean) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdCounter = useRef(0);

    const addParticle = useCallback((x: number, y: number, color: string) => {
        if (!visualEffectsEnabled) return;
        // Create fewer particles for better performance
        for (let i = 0; i < 5; i++) {
            const newParticle: Particle = {
                id: particleIdCounter.current++,
                startX: x,
                startY: y,
                color,
            };
            setParticles(prev => [...prev, newParticle]);
        }
    }, [visualEffectsEnabled]);

    const removeParticle = useCallback((id: number) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    }, []);

    return { particles, addParticle, removeParticle };
};
