
import { Action } from '../../lib/types';

export type ClickerAction = 
    | { type: 'CLICK_CORE' };

export const clickCore = (): ClickerAction => ({
    type: 'CLICK_CORE'
});
