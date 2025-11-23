import { describe, it, expect } from 'vitest';
import { selectCoreMultiplier, selectIsReady, selectCountdown } from '../selectors';
import { RootState } from '../../../lib/store';
import { CORE_CONFIG } from '../model';

describe('Core Selectors', () => {
    const createMockState = (coreOverrides: Partial<RootState['core']> = {}): RootState => ({
        resources: { energy: 0, totalGenerated: 0 },
        upgrades: { available: [] },
        ui: {
            floatingTexts: [],
            isMobile: false,
            activeMobileTab: 'REACTOR',
            activeCategory: 'ALL',
            lastPlasmaFlash: 0,
        },
        core: {
            charge: 0,
            status: 'CHARGING',
            activeTimeRemaining: 0,
            stats: { activations: 0 },
            ...coreOverrides,
        },
    });

    describe('selectCoreMultiplier', () => {
        it('should return 1 when core is CHARGING', () => {
            const state = createMockState({ status: 'CHARGING' });
            const multiplier = selectCoreMultiplier(state);
            expect(multiplier).toBe(1);
        });

        it('should return 1 when core is READY', () => {
            const state = createMockState({ status: 'READY', charge: 100 });
            const multiplier = selectCoreMultiplier(state);
            expect(multiplier).toBe(1);
        });

        it('should return MULTIPLIER_ACTIVE when core is ACTIVE', () => {
            const state = createMockState({ status: 'ACTIVE', activeTimeRemaining: 5000 });
            const multiplier = selectCoreMultiplier(state);
            expect(multiplier).toBe(CORE_CONFIG.MULTIPLIER_ACTIVE);
            expect(multiplier).toBe(5);
        });
    });

    describe('selectIsReady', () => {
        it('should return false when core is CHARGING', () => {
            const state = createMockState({ status: 'CHARGING', charge: 50 });
            const isReady = selectIsReady(state);
            expect(isReady).toBe(false);
        });

        it('should return true when core is READY', () => {
            const state = createMockState({ status: 'READY', charge: 100 });
            const isReady = selectIsReady(state);
            expect(isReady).toBe(true);
        });

        it('should return false when core is ACTIVE', () => {
            const state = createMockState({ status: 'ACTIVE', activeTimeRemaining: 5000 });
            const isReady = selectIsReady(state);
            expect(isReady).toBe(false);
        });
    });

    describe('selectCountdown', () => {
        it('should return 0 when core is not ACTIVE', () => {
            const state = createMockState({ status: 'CHARGING' });
            const countdown = selectCountdown(state);
            expect(countdown).toBe(0);
        });

        it('should return countdown in seconds when ACTIVE', () => {
            const state = createMockState({ status: 'ACTIVE', activeTimeRemaining: 5500 });
            const countdown = selectCountdown(state);
            expect(countdown).toBe(6); // Math.ceil(5500 / 1000)
        });

        it('should round up to nearest second', () => {
            const state = createMockState({ status: 'ACTIVE', activeTimeRemaining: 100 });
            const countdown = selectCountdown(state);
            expect(countdown).toBe(1); // Math.ceil(100 / 1000)
        });

        it('should return 0 when activeTimeRemaining is 0', () => {
            const state = createMockState({ status: 'ACTIVE', activeTimeRemaining: 0 });
            const countdown = selectCountdown(state);
            expect(countdown).toBe(0);
        });
    });
});
