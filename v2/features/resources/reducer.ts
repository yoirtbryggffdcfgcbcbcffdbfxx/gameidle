import { ResourceState } from './model';
import { GameAction } from '../../lib/types';

export const resourceReducer = (state: ResourceState, action: GameAction): ResourceState => {
    switch (action.type) {
        case 'RESOURCE_ADD':
            return {
                ...state,
                energy: state.energy + action.payload.amount,
                totalGenerated: state.totalGenerated + action.payload.amount
            };
        case 'RESOURCE_SPEND':
            return {
                ...state,
                energy: Math.max(0, state.energy - action.payload.amount)
            };

        case 'CLICK_CORE':
            return {
                ...state,
                energy: state.energy + action.payload.amount,
                totalGenerated: state.totalGenerated + action.payload.amount
            };

        case 'TICK':
            if (action.payload.productionGenerated > 0) {
                return {
                    ...state,
                    energy: state.energy + action.payload.productionGenerated,
                    totalGenerated: state.totalGenerated + action.payload.productionGenerated
                };
            }
            return state;

        case 'UPGRADE_BUY':
            return {
                ...state,
                energy: state.energy - action.payload.cost
            };

        default:
            return state;
    }
};