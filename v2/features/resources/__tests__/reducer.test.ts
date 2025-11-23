import { describe, it, expect } from 'vitest';
import { resourceReducer } from '../reducer';
import { ResourceState } from '../model';
import { GameAction } from '../../../lib/types';

describe('Resources Reducer', () => {
    const initialState: ResourceState = {
        energy: 0,
        totalGenerated: 0,
    };

    describe('RESOURCE_ADD', () => {
        it('should add energy and totalGenerated', () => {
            const action: GameAction = {
                type: 'RESOURCE_ADD',
                payload: { amount: 100 },
            };

            const newState = resourceReducer(initialState, action);

            expect(newState.energy).toBe(100);
            expect(newState.totalGenerated).toBe(100);
        });

        it('should accumulate energy', () => {
            const state: ResourceState = {
                energy: 500,
                totalGenerated: 1000,
            };

            const action: GameAction = {
                type: 'RESOURCE_ADD',
                payload: { amount: 250 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(750);
            expect(newState.totalGenerated).toBe(1250);
        });
    });

    describe('RESOURCE_SPEND', () => {
        it('should decrease energy but not totalGenerated', () => {
            const state: ResourceState = {
                energy: 500,
                totalGenerated: 1000,
            };

            const action: GameAction = {
                type: 'RESOURCE_SPEND',
                payload: { amount: 200 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(300);
            expect(newState.totalGenerated).toBe(1000); // Inchangé
        });

        it('should not go below 0 energy', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 500,
            };

            const action: GameAction = {
                type: 'RESOURCE_SPEND',
                payload: { amount: 200 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(0); // Math.max(0, 100 - 200)
            expect(newState.totalGenerated).toBe(500);
        });
    });

    describe('CLICK_CORE (cross-feature)', () => {
        it('should add energy from click', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 200,
            };

            const action: GameAction = {
                type: 'CLICK_CORE',
                payload: { amount: 50 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(150);
            expect(newState.totalGenerated).toBe(250);
        });
    });

    describe('TICK (cross-feature)', () => {
        it('should add production when productionGenerated > 0', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 500,
            };

            const action: GameAction = {
                type: 'TICK',
                payload: { delta: 100, productionGenerated: 25 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(125);
            expect(newState.totalGenerated).toBe(525);
        });

        it('should not mutate state when productionGenerated = 0', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 500,
            };

            const action: GameAction = {
                type: 'TICK',
                payload: { delta: 100, productionGenerated: 0 },
            };

            const newState = resourceReducer(state, action);

            expect(newState).toBe(state); // Même référence (optimisation)
        });
    });

    describe('UPGRADE_BUY (cross-feature)', () => {
        it('should deduct cost from energy', () => {
            const state: ResourceState = {
                energy: 1000,
                totalGenerated: 2000,
            };

            const action: GameAction = {
                type: 'UPGRADE_BUY',
                payload: { id: 'gen1', cost: 300 },
            };

            const newState = resourceReducer(state, action);

            expect(newState.energy).toBe(700);
            expect(newState.totalGenerated).toBe(2000); // Inchangé
        });
    });

    describe('Immutability', () => {
        it('should return new state object', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 200,
            };

            const action: GameAction = {
                type: 'RESOURCE_ADD',
                payload: { amount: 50 },
            };

            const newState = resourceReducer(state, action);

            expect(newState).not.toBe(state);
        });

        it('should not mutate original state', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 200,
            };

            const action: GameAction = {
                type: 'RESOURCE_ADD',
                payload: { amount: 50 },
            };

            resourceReducer(state, action);

            expect(state.energy).toBe(100); // Inchangé
            expect(state.totalGenerated).toBe(200); // Inchangé
        });
    });

    describe('Default case', () => {
        it('should return state unchanged for unknown actions', () => {
            const state: ResourceState = {
                energy: 100,
                totalGenerated: 200,
            };

            const action: GameAction = {
                type: 'UI_SET_MOBILE_TAB',
                payload: { tab: 'FORGE' },
            };

            const newState = resourceReducer(state, action);

            expect(newState).toBe(state);
        });
    });
});
