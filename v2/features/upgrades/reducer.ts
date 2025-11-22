import { UpgradesState } from './model';
import { GameAction } from '../../lib/types';

export const upgradesReducer = (state: UpgradesState, action: GameAction): UpgradesState => {
    switch (action.type) {
        case 'UPGRADE_BUY':
            return {
                ...state,
                available: state.available.map(u => {
                    if (u.id === action.payload.id) {
                        // Consommer le discount s'il existe
                        const newUpgrade = {
                            ...u,
                            owned: u.owned + 1,
                            nextLevelCostOverride: undefined // Discount consommé
                        };
                        return newUpgrade;
                    }
                    return u;
                })
            };

        case 'UPGRADE_BUY_TIER':
            return {
                ...state,
                available: state.available.map(u => {
                    if (u.id === action.payload.id) {
                        // Augmenter le tier et définir le discount pour le prochain achat
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
            return state;
    }
};