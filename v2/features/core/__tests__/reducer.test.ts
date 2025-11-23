import { describe, it, expect } from 'vitest';
import { coreReducer } from '../reducer';
import { CoreState, CORE_CONFIG } from '../model';
import { GameAction } from '../../../lib/types';

describe('Core Reducer', () => {
    const initialState: CoreState = {
        charge: 0,
        status: 'CHARGING',
        activeTimeRemaining: 0,
        stats: { activations: 0 },
    };

    describe('TICK - Charging', () => {
        it('should increment charge when CHARGING', () => {
            const state: CoreState = { ...initialState, charge: 0, status: 'CHARGING' };
            const action: GameAction = { type: 'TICK', payload: { delta: 1000, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            // 1000ms = 1 seconde → 2.5% de charge
            expect(newState.charge).toBe(2.5);
            expect(newState.status).toBe('CHARGING');
        });

        it('should change status to READY when charge reaches 100', () => {
            const state: CoreState = { ...initialState, charge: 99.5, status: 'CHARGING' };
            const action: GameAction = { type: 'TICK', payload: { delta: 1000, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            expect(newState.charge).toBe(100);
            expect(newState.status).toBe('READY');
        });

        it('should not exceed 100% charge', () => {
            const state: CoreState = { ...initialState, charge: 98, status: 'CHARGING' };
            const action: GameAction = { type: 'TICK', payload: { delta: 2000, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            expect(newState.charge).toBe(100);
        });
    });

    describe('TICK - Active (Discharging)', () => {
        it('should decrement activeTimeRemaining when ACTIVE', () => {
            const state: CoreState = {
                ...initialState,
                status: 'ACTIVE',
                activeTimeRemaining: 5000,
            };
            const action: GameAction = { type: 'TICK', payload: { delta: 100, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            expect(newState.activeTimeRemaining).toBe(4900);
            expect(newState.status).toBe('ACTIVE');
        });

        it('should return to CHARGING when activeTimeRemaining reaches 0', () => {
            const state: CoreState = {
                ...initialState,
                status: 'ACTIVE',
                activeTimeRemaining: 50,
                charge: 100,
            };
            const action: GameAction = { type: 'TICK', payload: { delta: 100, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            expect(newState.status).toBe('CHARGING');
            expect(newState.activeTimeRemaining).toBe(0);
            expect(newState.charge).toBe(0);
        });
    });

    describe('CORE_ACTIVATE', () => {
        it('should activate core when status is READY', () => {
            const state: CoreState = {
                ...initialState,
                charge: 100,
                status: 'READY',
                stats: { activations: 5 },
            };
            const action: GameAction = { type: 'CORE_ACTIVATE' };

            const newState = coreReducer(state, action);

            expect(newState.status).toBe('ACTIVE');
            expect(newState.charge).toBe(0);
            expect(newState.activeTimeRemaining).toBe(CORE_CONFIG.DISCHARGE_DURATION_MS);
            expect(newState.stats.activations).toBe(6);
        });

        it('should not activate if status is CHARGING', () => {
            const state: CoreState = {
                ...initialState,
                charge: 50,
                status: 'CHARGING',
            };
            const action: GameAction = { type: 'CORE_ACTIVATE' };

            const newState = coreReducer(state, action);

            expect(newState).toBe(state); // Même référence
        });

        it('should not activate if status is ACTIVE', () => {
            const state: CoreState = {
                ...initialState,
                status: 'ACTIVE',
                activeTimeRemaining: 5000,
            };
            const action: GameAction = { type: 'CORE_ACTIVATE' };

            const newState = coreReducer(state, action);

            expect(newState).toBe(state);
        });
    });

    describe('Immutability', () => {
        it('should return new state object when mutating', () => {
            const state: CoreState = { ...initialState };
            const action: GameAction = { type: 'TICK', payload: { delta: 100, productionGenerated: 0 } };

            const newState = coreReducer(state, action);

            expect(newState).not.toBe(state);
        });

        it('should not mutate original state', () => {
            const state: CoreState = { ...initialState, charge: 50 };
            const originalCharge = state.charge;
            const action: GameAction = { type: 'TICK', payload: { delta: 1000, productionGenerated: 0 } };

            coreReducer(state, action);

            expect(state.charge).toBe(originalCharge);
        });
    });

    describe('Default case', () => {
        it('should return state unchanged for unknown actions', () => {
            const state: CoreState = { ...initialState };
            const action: GameAction = { type: 'RESOURCE_ADD', payload: { amount: 100 } };

            const newState = coreReducer(state, action);

            expect(newState).toBe(state);
        });
    });
});
