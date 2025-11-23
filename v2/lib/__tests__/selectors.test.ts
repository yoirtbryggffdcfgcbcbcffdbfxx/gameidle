import { describe, it, expect } from 'vitest';
import { selectGlobalMultiplier, selectEffectiveProduction } from '../selectors';
import { RootState } from '../store';
import { Upgrade } from '../../features/upgrades/model';

describe('Global Selectors', () => {
    const createMockState = (overrides: Partial<RootState> = {}): RootState => ({
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
        },
        ...overrides,
    });

    describe('selectGlobalMultiplier', () => {
        it('should return 1 with no boosters and inactive core', () => {
            const state = createMockState();
            const multiplier = selectGlobalMultiplier(state);
            expect(multiplier).toBe(1);
        });

        it('should apply booster bonus', () => {
            const booster: Upgrade = {
                id: 'boost1',
                name: 'Booster 1',
                description: 'Test',
                baseCost: 1000,
                baseProduction: 10,
                owned: 2,
                tier: 0,
                color: '#fff',
                type: 'BOOSTER',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [booster] },
            });

            const multiplier = selectGlobalMultiplier(state);
            // 1 * (1 + 20/100) = 1.2
            expect(multiplier).toBe(1.2);
        });

        it('should apply core multiplier when active', () => {
            const state = createMockState({
                core: {
                    charge: 100,
                    status: 'ACTIVE',
                    activeTimeRemaining: 5000,
                    stats: { activations: 1 },
                },
            });

            const multiplier = selectGlobalMultiplier(state);
            // 1 * 5 = 5
            expect(multiplier).toBe(5);
        });

        it('should combine boosters and core', () => {
            const booster: Upgrade = {
                id: 'boost1',
                name: 'Booster 1',
                description: 'Test',
                baseCost: 1000,
                baseProduction: 10,
                owned: 2,
                tier: 0,
                color: '#fff',
                type: 'BOOSTER',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [booster] },
                core: {
                    charge: 100,
                    status: 'ACTIVE',
                    activeTimeRemaining: 5000,
                    stats: { activations: 1 },
                },
            });

            const multiplier = selectGlobalMultiplier(state);
            // (1 + 20/100) * 5 = 1.2 * 5 = 6
            expect(multiplier).toBe(6);
        });

        it('should not apply core multiplier when status is READY', () => {
            const state = createMockState({
                core: {
                    charge: 100,
                    status: 'READY',
                    activeTimeRemaining: 0,
                    stats: { activations: 0 },
                },
            });

            const multiplier = selectGlobalMultiplier(state);
            expect(multiplier).toBe(1);
        });

        it('should not apply core multiplier when status is CHARGING', () => {
            const state = createMockState({
                core: {
                    charge: 50,
                    status: 'CHARGING',
                    activeTimeRemaining: 0,
                    stats: { activations: 0 },
                },
            });

            const multiplier = selectGlobalMultiplier(state);
            expect(multiplier).toBe(1);
        });
    });

    describe('selectEffectiveProduction', () => {
        it('should return 0 with no production upgrades', () => {
            const state = createMockState();
            const production = selectEffectiveProduction(state);
            expect(production).toBe(0);
        });

        it('should multiply base production by global multiplier', () => {
            const prodUpgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 10,
                owned: 5,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [prodUpgrade] },
            });

            const production = selectEffectiveProduction(state);
            // Base: 10 * (3^0) * 5 = 50
            // Multiplier: 1
            // Effective: 50 * 1 = 50
            expect(production).toBe(50);
        });

        it('should apply booster to production', () => {
            const prodUpgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 10,
                owned: 5,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const booster: Upgrade = {
                id: 'boost1',
                name: 'Booster 1',
                description: 'Test',
                baseCost: 1000,
                baseProduction: 10,
                owned: 2,
                tier: 0,
                color: '#fff',
                type: 'BOOSTER',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [prodUpgrade, booster] },
            });

            const production = selectEffectiveProduction(state);
            // Base: 10 * (3^0) * 5 = 50
            // Multiplier: 1 * (1 + 20/100) = 1.2
            // Effective: 50 * 1.2 = 60
            expect(production).toBe(60);
        });

        it('should apply core boost to production', () => {
            const prodUpgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 10,
                owned: 5,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [prodUpgrade] },
                core: {
                    charge: 100,
                    status: 'ACTIVE',
                    activeTimeRemaining: 5000,
                    stats: { activations: 1 },
                },
            });

            const production = selectEffectiveProduction(state);
            // Base: 10 * (3^0) * 5 = 50
            // Multiplier: 1 * 5 = 5
            // Effective: 50 * 5 = 250
            expect(production).toBe(250);
        });

        it('should combine all multipliers', () => {
            const prodUpgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 10,
                owned: 5,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const booster: Upgrade = {
                id: 'boost1',
                name: 'Booster 1',
                description: 'Test',
                baseCost: 1000,
                baseProduction: 10,
                owned: 2,
                tier: 0,
                color: '#fff',
                type: 'BOOSTER',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state = createMockState({
                upgrades: { available: [prodUpgrade, booster] },
                core: {
                    charge: 100,
                    status: 'ACTIVE',
                    activeTimeRemaining: 5000,
                    stats: { activations: 1 },
                },
            });

            const production = selectEffectiveProduction(state);
            // Base: 10 * (3^0) * 5 = 50
            // Multiplier: (1 + 20/100) * 5 = 1.2 * 5 = 6
            // Effective: 50 * 6 = 300
            expect(production).toBe(300);
        });
    });
});
