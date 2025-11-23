import { CoreState, CORE_CONFIG } from './model';
import { GameAction } from '../../lib/types';

/**
 * Reducer pour la feature Core.
 * 
 * Gère la charge automatique et l'activation manuelle du cœur quantique.
 * 
 * @param state - État actuel du core
 * @param action - Action dispatchée (typée avec GameAction)
 * @returns Nouvel état après application de l'action
 * 
 * @remarks
 * Ce reducer gère :
 * - TICK : Charge/décharge automatique du core
 * - CORE_ACTIVATE : Activation manuelle du boost x5
 */
export const coreReducer = (state: CoreState, action: GameAction): CoreState => {
    switch (action.type) {
        case 'TICK': {
            const { delta } = action.payload;

            // ─────────────────────────────────────────────────────────
            // Cas 1 : Core ACTIF (décharge en cours)
            // ─────────────────────────────────────────────────────────
            /**
             * Pendant l'activation, le core se décharge progressivement.
             * Quand activeTimeRemaining atteint 0, retour à CHARGING.
             */
            if (state.status === 'ACTIVE') {
                const newTimeRemaining = state.activeTimeRemaining - delta;

                if (newTimeRemaining <= 0) {
                    return {
                        ...state,
                        status: 'CHARGING',
                        activeTimeRemaining: 0,
                        charge: 0
                    };
                }

                return {
                    ...state,
                    activeTimeRemaining: newTimeRemaining
                };
            }

            // ─────────────────────────────────────────────────────────
            // Cas 2 : Core en CHARGE (passif)
            // ─────────────────────────────────────────────────────────
            /**
             * Charge automatique selon CORE_CONFIG.CHARGE_RATE_PER_SEC.
             * Passage à READY quand charge atteint 100%.
             */
            if (state.status === 'CHARGING') {
                // Calcul de l'incrément : (Taux par sec / 1000) * delta_ms
                const chargeIncrement = (CORE_CONFIG.CHARGE_RATE_PER_SEC / 1000) * delta;
                const newCharge = state.charge + chargeIncrement;

                if (newCharge >= 100) {
                    return {
                        ...state,
                        charge: 100,
                        status: 'READY'
                    };
                }

                return {
                    ...state,
                    charge: newCharge
                };
            }

            return state;
        }

        case 'CORE_ACTIVATE':
            // ─────────────────────────────────────────────────────────
            // Activation manuelle du core (seulement si READY)
            // ─────────────────────────────────────────────────────────
            /**
             * Active le boost x5 pendant DISCHARGE_DURATION_MS.
             * Incrémente le compteur d'activations.
             */
            if (state.status === 'READY') {
                return {
                    ...state,
                    status: 'ACTIVE',
                    charge: 0,
                    activeTimeRemaining: CORE_CONFIG.DISCHARGE_DURATION_MS,
                    stats: {
                        ...state.stats,
                        activations: state.stats.activations + 1
                    }
                };
            }
            return state;

        default:
            return state;
    }
};
