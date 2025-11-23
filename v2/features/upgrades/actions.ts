import { Action } from '../../lib/types';

/**
 * Union discriminée de toutes les actions liées aux Upgrades.
 * 
 * Ces actions sont dispatchées lors de l'achat d'améliorations
 * et modifient l'état `upgrades` via le reducer.
 */
export type UpgradeAction =
    /** Achat standard d'une unité d'upgrade */
    | { type: 'UPGRADE_BUY'; payload: { id: string; cost: number } }
    /** Achat d'un tier complet (palier 10, 25, 100) avec discount */
    | { type: 'UPGRADE_BUY_TIER'; payload: { id: string; cost: number } };

/**
 * Créateur d'action pour acheter une unité d'upgrade.
 * 
 * @param id - Identifiant unique de l'upgrade (ex: 'gen1', 'click2')
 * @param cost - Coût total de l'achat (déjà calculé avec scaling)
 * 
 * @returns Action UPGRADE_BUY qui :
 * - Incrémente `owned` de 1
 * - Déduit le coût de l'énergie (géré par le reducer resources)
 * - Met à jour le tier si nécessaire
 * 
 * @example
 * ```ts
 * const action = buyUpgrade('gen1', 150);
 * dispatch(action);
 * ```
 */
export const buyUpgrade = (id: string, cost: number): UpgradeAction => ({
    type: 'UPGRADE_BUY',
    payload: { id, cost }
});

/**
 * Créateur d'action pour acheter un tier complet d'upgrade.
 * 
 * Utilisé lorsque le joueur atteint un palier (10, 25, 100 unités).
 * Applique généralement un discount sur le coût.
 * 
 * @param id - Identifiant unique de l'upgrade
 * @param cost - Coût total du tier (avec discount appliqué)
 * 
 * @returns Action UPGRADE_BUY_TIER qui :
 * - Incrémente `owned` du montant du tier
 * - Déduit le coût de l'énergie
 * - Incrémente le niveau de tier
 * - Applique `nextLevelCostOverride` si défini
 * 
 * @example
 * ```ts
 * const action = buyTierUpgrade('gen1', 5000);
 * dispatch(action);
 * ```
 */
export const buyTierUpgrade = (id: string, cost: number): UpgradeAction => ({
    type: 'UPGRADE_BUY_TIER',
    payload: { id, cost }
});
