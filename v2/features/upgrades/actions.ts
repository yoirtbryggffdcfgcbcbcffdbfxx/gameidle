
import { Action } from '../../lib/types';

export type UpgradeAction =
    | { type: 'UPGRADE_BUY'; payload: { id: string; cost: number } }
    | { type: 'UPGRADE_BUY_TIER'; payload: { id: string; cost: number } };

export const buyUpgrade = (id: string, cost: number): UpgradeAction => ({
    type: 'UPGRADE_BUY',
    payload: { id, cost }
});

export const buyTierUpgrade = (id: string, cost: number): UpgradeAction => ({
    type: 'UPGRADE_BUY_TIER',
    payload: { id, cost }
});
