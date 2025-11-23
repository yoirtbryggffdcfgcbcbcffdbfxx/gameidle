/**
 * Statut du core quantique.
 * 
 * - `CHARGING` : En charge (0-99%)
 * - `READY` : Prêt à activer (100%)
 * - `ACTIVE` : Activé (boost x5 actif)
 */
export type CoreStatus = 'CHARGING' | 'READY' | 'ACTIVE';

/**
 * État global de la feature Core.
 * 
 * Gère le système de charge/activation du core quantique.
 */
export interface CoreState {
    /** Niveau de charge actuel (0 à 100) */
    charge: number;

    /** Statut actuel du core */
    status: CoreStatus;

    /** Temps restant d'activation en millisecondes */
    activeTimeRemaining: number;

    /** Statistiques de progression */
    stats: {
        /** Nombre total d'activations du core */
        activations: number;
    };
}

/**
 * État initial de la feature Core.
 * 
 * Le core commence déchargé et en statut CHARGING.
 */
export const initialCoreState: CoreState = {
    charge: 0,
    status: 'CHARGING',
    activeTimeRemaining: 0,
    stats: {
        activations: 0
    }
};

/**
 * Configuration du système de core.
 * 
 * Ces constantes définissent le comportement du core quantique.
 */
export const CORE_CONFIG = {
    /** Vitesse de charge en % par seconde */
    CHARGE_RATE_PER_SEC: 2.5,

    /** Durée de l'activation en millisecondes (10 secondes) */
    DISCHARGE_DURATION_MS: 10000,

    /** Multiplicateur de production pendant l'activation */
    MULTIPLIER_ACTIVE: 5,
};
