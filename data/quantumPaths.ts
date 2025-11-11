import { QuantumPath, QuantumPathType } from '../types';

export const QUANTUM_PATHS: Record<QuantumPathType, QuantumPath> = {
    RATE: {
        name: "Vitesse",
        description: "Se concentre sur l'accélération drastique de la vitesse de charge du Cœur Quantique.",
        upgrades: [
            { level: 1, description: "Vitesse de charge +15%", cost: 5, effects: { rate: 0.15 } },
            { level: 2, description: "Vitesse de charge +20%", cost: 10, effects: { rate: 0.20 } },
            { level: 3, description: "Vitesse de charge +25%", cost: 20, effects: { rate: 0.25 } },
            { level: 4, description: "Vitesse de charge +30%", cost: 40, effects: { rate: 0.30 } },
            { level: 5, description: "Vitesse de charge +50% (Bonus final)", cost: 80, effects: { rate: 0.50 } },
        ],
    },
    MULTIPLIER: {
        name: "Puissance",
        description: "Augmente massivement le multiplicateur de production d'énergie lorsque le Cœur est actif.",
        upgrades: [
            { level: 1, description: "Multiplicateur de boost +0.5x", cost: 5, effects: { multiplier: 0.5 } },
            { level: 2, description: "Multiplicateur de boost +0.75x", cost: 12, effects: { multiplier: 0.75 } },
            { level: 3, description: "Multiplicateur de boost +1.0x", cost: 25, effects: { multiplier: 1.0 } },
            { level: 4, description: "Multiplicateur de boost +1.5x", cost: 50, effects: { multiplier: 1.5 } },
            { level: 5, description: "Multiplicateur de boost +2.5x (Bonus final)", cost: 100, effects: { multiplier: 2.5 } },
        ],
    },
    BALANCED: {
        name: "Équilibre",
        description: "Améliore modérément à la fois la vitesse de charge et le multiplicateur de boost.",
        upgrades: [
            { level: 1, description: "Vitesse +8%, Multiplicateur +0.2x", cost: 5, effects: { rate: 0.08, multiplier: 0.2 } },
            { level: 2, description: "Vitesse +10%, Multiplicateur +0.3x", cost: 11, effects: { rate: 0.10, multiplier: 0.3 } },
            { level: 3, description: "Vitesse +12%, Multiplicateur +0.4x", cost: 22, effects: { rate: 0.12, multiplier: 0.4 } },
            { level: 4, description: "Vitesse +15%, Multiplicateur +0.6x", cost: 45, effects: { rate: 0.15, multiplier: 0.6 } },
            { level: 5, description: "Vitesse +25%, Multiplicateur +1.0x (Bonus final)", cost: 90, effects: { rate: 0.25, multiplier: 1.0 } },
        ],
    }
};