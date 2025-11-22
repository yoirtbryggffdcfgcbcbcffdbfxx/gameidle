
import { Action } from '../../lib/types';

export type CoreAction = 
    | { type: 'CORE_ACTIVATE' };

export const activateCore = (): CoreAction => ({
    type: 'CORE_ACTIVATE'
});
