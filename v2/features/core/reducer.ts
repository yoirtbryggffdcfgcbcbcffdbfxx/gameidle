
import { CoreState, CORE_CONFIG } from './model';
import { GameAction } from '../../lib/types';

export const coreReducer = (state: CoreState, action: GameAction): CoreState => {
    switch (action.type) {
        case 'TICK': {
            const { delta } = action.payload;
            
            // 1. Gestion de l'état ACTIF (Décharge)
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

            // 2. Gestion de l'état CHARGE (Passif)
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
