import { Action } from '../../lib/types';

/**
 * Union discriminée de toutes les actions liées aux Resources.
 * 
 * Ces actions modifient l'énergie du joueur (ajout ou dépense).
 */
export type ResourceAction =
    /** Ajoute de l'énergie (production passive, clic) */
    | { type: 'RESOURCE_ADD'; payload: { amount: number } }
    /** Dépense de l'énergie (achat d'upgrade) */
    | { type: 'RESOURCE_SPEND'; payload: { amount: number } };

/**
 * Créateur d'action pour ajouter de l'énergie.
 * 
 * @param amount - Quantité d'énergie à ajouter
 * @returns Action RESOURCE_ADD qui :
 * - Incrémente `energy` de `amount`
 * - Incrémente `totalGenerated` de `amount`
 * 
 * @example
 * ```ts
 * const action = addEnergy(100);
 * dispatch(action);
 * ```
 * 
 * @remarks
 * Cette action est généralement dispatchée par :
 * - Le système de TICK (production passive)
 * - Le clic manuel sur le core (CLICK_CORE)
 */
export const addEnergy = (amount: number): ResourceAction => ({
    type: 'RESOURCE_ADD',
    payload: { amount }
});
