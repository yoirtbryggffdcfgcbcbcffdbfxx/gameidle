import { describe, it, expect } from 'vitest';
import { upgradesReducer } from '../reducer';
import { UpgradesState, Upgrade } from '../model';
import { GameAction } from '../../../lib/types';

describe('Upgrades Reducer', () => {
    const createMockUpgrade = (overrides: Partial<Upgrade> = {}): Upgrade => ({
        id: 'test-upgrade',
        name: 'Test Upgrade',
        description: 'Test description',
        baseCost: 100,
        baseProduction: 1,
        owned: 0,
        tier: 0,
        color: '#ffffff',
        type: 'PRODUCTION',
        unlockCost: 0,
        requiredAscension: 0,
        ...overrides,
    });

    describe('UPGRADE_BUY', () => {
        it('should increment owned by 1', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', owned: 5 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY',
                payload: { id: 'gen1', cost: 200 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState.available[0].owned).toBe(6);
        });

        it('should consume discount (nextLevelCostOverride)', () => {
            const upgrade = createMockUpgrade({
                id: 'gen1',
                owned: 10,
                nextLevelCostOverride: 500,
            });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY',
                payload: { id: 'gen1', cost: 500 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState.available[0].nextLevelCostOverride).toBeUndefined();
        });

        it('should not modify other upgrades', () => {
            const upgrade1 = createMockUpgrade({ id: 'gen1', owned: 5 });
            const upgrade2 = createMockUpgrade({ id: 'gen2', owned: 3 });
            const state: UpgradesState = {
                available: [upgrade1, upgrade2],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY',
                payload: { id: 'gen1', cost: 200 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState.available[0].owned).toBe(6);
            expect(newState.available[1].owned).toBe(3); // Inchangé
        });

        it('should return new state (immutability)', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', owned: 5 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY',
                payload: { id: 'gen1', cost: 200 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState).not.toBe(state);
            expect(newState.available).not.toBe(state.available);
            expect(newState.available[0]).not.toBe(state.available[0]);
        });
    });

    describe('UPGRADE_BUY_TIER', () => {
        it('should increment tier by 1', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', tier: 0 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY_TIER',
                payload: { id: 'gen1', cost: 2000 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState.available[0].tier).toBe(1);
        });

        it('should apply 10% discount to nextLevelCostOverride', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', tier: 0 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY_TIER',
                payload: { id: 'gen1', cost: 2000 },
            };

            const newState = upgradesReducer(state, action);

            // 2000 * 0.9 = 1800
            expect(newState.available[0].nextLevelCostOverride).toBe(1800);
        });

        it('should floor the discounted cost', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', tier: 0 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY_TIER',
                payload: { id: 'gen1', cost: 2555 },
            };

            const newState = upgradesReducer(state, action);

            // 2555 * 0.9 = 2299.5 → 2299
            expect(newState.available[0].nextLevelCostOverride).toBe(2299);
        });

        it('should not modify owned count', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', owned: 10, tier: 0 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY_TIER',
                payload: { id: 'gen1', cost: 2000 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState.available[0].owned).toBe(10); // Inchangé
        });
    });

    describe('Default case', () => {
        it('should return state unchanged for unknown actions', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', owned: 5 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'TICK',
                payload: { delta: 100, productionGenerated: 50 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState).toBe(state); // Même référence
        });

        it('should return state unchanged for RESOURCE_ADD', () => {
            const upgrade = createMockUpgrade({ id: 'gen1', owned: 5 });
            const state: UpgradesState = {
                available: [upgrade],
            };

            const action: GameAction = {
                type: 'RESOURCE_ADD',
                payload: { amount: 100 },
            };

            const newState = upgradesReducer(state, action);

            expect(newState).toBe(state);
        });
    });
});
