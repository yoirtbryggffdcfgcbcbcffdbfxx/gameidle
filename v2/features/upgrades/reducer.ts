import { UpgradesState } from './model';
import { GameAction } from '../../lib/types';

export const upgradesReducer = (state: UpgradesState, action: GameAction): UpgradesState => {
    switch (action.type) {
        case 'UPGRADE_BUY':
            return {
                ...state,
                available: state.available.map(u => {
                    if (u.id === action.payload.id) {
                        return { ...u, owned: u.owned + 1 };
                    }
                    return u;
                })
            };
        default:
            return state;
    }
};