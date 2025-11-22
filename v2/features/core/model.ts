
export type CoreStatus = 'CHARGING' | 'READY' | 'ACTIVE';

export interface CoreState {
    charge: number; // 0 à 100
    status: CoreStatus;
    activeTimeRemaining: number; // en ms
    stats: {
        activations: number;
    };
}

export const initialCoreState: CoreState = {
    charge: 0,
    status: 'CHARGING',
    activeTimeRemaining: 0,
    stats: {
        activations: 0
    }
};

// Constantes de configuration (Pourraient être déplacées dans un config file)
export const CORE_CONFIG = {
    CHARGE_RATE_PER_SEC: 2.5, // % par seconde
    DISCHARGE_DURATION_MS: 10000, // 10 secondes
    MULTIPLIER_ACTIVE: 5, // x5 production
};
