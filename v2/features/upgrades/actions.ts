
import { Action } from '../../lib/types';

export type UpgradeAction = 
    | { type: 'UPGRADE_BUY'; payload: { id: string; cost: number } };

export const buyUpgrade = (id: string, cost: number): UpgradeAction => ({
    type: 'UPGRADE_BUY',
    payload: { id, cost }
});
