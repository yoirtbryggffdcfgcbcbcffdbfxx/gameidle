import { Action } from '../../lib/types';

/**
 * Union discriminée de toutes les actions liées au Clicker.
 * 
 * Gère les clics manuels sur le core pour générer de l'énergie.
 */
export type ClickerAction =
    /** Clic manuel sur le core quantique */
    | { type: 'CLICK_CORE'; payload: { amount: number } };

/**
 * Créateur d'action pour un clic sur le core.
 * 
 * @param amount - Quantité d'énergie générée par le clic (calculée via `selectClickPower`)
 * @returns Action CLICK_CORE qui ajoute de l'énergie
 * 
 * @example
 * ```ts
 * const clickPower = selectClickPower(state);
 * dispatch(clickCore(clickPower));
 * ```
 */
export const clickCore = (amount: number): ClickerAction => ({
    type: 'CLICK_CORE',
    payload: { amount }
});
