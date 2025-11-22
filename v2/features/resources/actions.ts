
import { Action } from '../../lib/types';

export type ResourceAction = 
    | { type: 'RESOURCE_ADD'; payload: { amount: number } }
    | { type: 'RESOURCE_SPEND'; payload: { amount: number } };

// Action Creators (Pour simplifier l'appel dans l'UI)
export const addEnergy = (amount: number): ResourceAction => ({
    type: 'RESOURCE_ADD',
    payload: { amount }
});
