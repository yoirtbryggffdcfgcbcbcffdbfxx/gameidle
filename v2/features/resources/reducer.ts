import { ResourceState } from './model';
import { GameAction } from '../../lib/types';

/**
 * Reducer pour la feature Resources.
 * 
 * Gère les mutations de l'énergie en réponse aux actions du jeu.
 * Ce reducer écoute également des actions d'autres features (cross-feature).
 * 
 * @param state - État actuel des resources
 * @param action - Action dispatchée (typée avec GameAction)
 * @returns Nouvel état après application de l'action
 * 
 * @remarks
 * Ce reducer gère :
 * - Les actions propres à Resources (RESOURCE_ADD, RESOURCE_SPEND)
 * - Les actions cross-feature (TICK, CLICK_CORE, UPGRADE_BUY)
 */
export const resourceReducer = (state: ResourceState, action: GameAction): ResourceState => {
    switch (action.type) {
        case 'RESOURCE_ADD':
            // ─────────────────────────────────────────────────────────
            // Ajout d'énergie générique
            // ─────────────────────────────────────────────────────────
            return {
                ...state,
                energy: state.energy + action.payload.amount,
                totalGenerated: state.totalGenerated + action.payload.amount
            };

        case 'RESOURCE_SPEND':
            // ─────────────────────────────────────────────────────────
            // Dépense d'énergie (achats)
            // ─────────────────────────────────────────────────────────
            /**
             * Note : `totalGenerated` n'est PAS affecté par les dépenses.
             * Math.max(0, ...) empêche l'énergie de devenir négative.
             */
            return {
                ...state,
                energy: Math.max(0, state.energy - action.payload.amount)
            };

        case 'CLICK_CORE':
            // ─────────────────────────────────────────────────────────
            // Clic manuel sur le core (cross-feature: clicker)
            // ─────────────────────────────────────────────────────────
            /**
             * Ajoute l'énergie générée par le clic.
             * Le montant est calculé par le selector `selectClickPower`.
             */
            return {
                ...state,
                energy: state.energy + action.payload.amount,
                totalGenerated: state.totalGenerated + action.payload.amount
            };

        case 'TICK':
            // ─────────────────────────────────────────────────────────
            // Production passive (cross-feature: core)
            // ─────────────────────────────────────────────────────────
            /**
             * Ajoute l'énergie générée par la production passive.
             * Optimisation : ne mute l'état que si production > 0.
             */
            if (action.payload.productionGenerated > 0) {
                return {
                    ...state,
                    energy: state.energy + action.payload.productionGenerated,
                    totalGenerated: state.totalGenerated + action.payload.productionGenerated
                };
            }
            return state;

        case 'UPGRADE_BUY':
            // ─────────────────────────────────────────────────────────
            // Achat d'upgrade (cross-feature: upgrades)
            // ─────────────────────────────────────────────────────────
            /**
             * Déduit le coût de l'upgrade de l'énergie disponible.
             * Note : La validation "peut-on acheter ?" est faite dans l'UI.
             */
            return {
                ...state,
                energy: state.energy - action.payload.cost
            };

        default:
            // Ignore les actions non liées aux resources
            return state;
    }
};