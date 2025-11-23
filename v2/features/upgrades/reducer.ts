import { UpgradesState } from './model';
import { GameAction } from '../../lib/types';

/**
 * Reducer pour la feature Upgrades.
 * 
 * Gère les mutations de l'état des améliorations en réponse aux actions.
 * Respecte le principe d'immutabilité : retourne toujours un nouvel état.
 * 
 * @param state - État actuel des upgrades
 * @param action - Action dispatchée (typée avec GameAction)
 * @returns Nouvel état après application de l'action
 * 
 * @remarks
 * Ce reducer ne gère QUE les actions liées aux upgrades.
 * Les autres actions (TICK, etc.) sont ignorées via le case default.
 */
export const upgradesReducer = (state: UpgradesState, action: GameAction): UpgradesState => {
    switch (action.type) {
        case 'UPGRADE_BUY':
            // ─────────────────────────────────────────────────────────
            // Achat standard d'une unité d'upgrade
            // ─────────────────────────────────────────────────────────
            return {
                ...state,
                available: state.available.map(u => {
                    if (u.id === action.payload.id) {
                        /**
                         * Logique d'achat :
                         * 1. Incrémente `owned` de 1
                         * 2. Consomme le discount (`nextLevelCostOverride`) s'il existe
                         * 
                         * Note : La déduction d'énergie est gérée par le reducer `resources`
                         */
                        const newUpgrade = {
                            ...u,
                            owned: u.owned + 1,
                            nextLevelCostOverride: undefined // Discount consommé après achat
                        };
                        return newUpgrade;
                    }
                    return u;
                })
            };

        case 'UPGRADE_BUY_TIER':
            // ─────────────────────────────────────────────────────────
            // Achat d'un tier complet (palier 10, 25, 100)
            // ─────────────────────────────────────────────────────────
            return {
                ...state,
                available: state.available.map(u => {
                    if (u.id === action.payload.id) {
                        /**
                         * Logique de tier :
                         * 1. Incrémente le niveau de tier
                         * 2. Applique un discount de 10% sur le prochain achat
                         * 
                         * Le discount est stocké dans `nextLevelCostOverride` et sera
                         * utilisé par le selector `selectUpgradeCost` pour calculer
                         * le prix du prochain achat.
                         */
                        const tierUpgradeCost = action.payload.cost;
                        const discountedCost = Math.floor(tierUpgradeCost * 0.9);

                        return {
                            ...u,
                            tier: u.tier + 1,
                            nextLevelCostOverride: discountedCost
                        };
                    }
                    return u;
                })
            };

        default:
            // Ignore les actions non liées aux upgrades
            return state;
    }
};