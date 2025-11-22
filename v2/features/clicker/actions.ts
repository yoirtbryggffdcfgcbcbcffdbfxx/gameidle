
import { Action } from '../../lib/types';

export type ClickerAction =
    | { type: 'CLICK_CORE'; payload: { amount: number } };

export const clickCore = (amount: number): ClickerAction => ({
    type: 'CLICK_CORE',
    payload: { amount }
});
