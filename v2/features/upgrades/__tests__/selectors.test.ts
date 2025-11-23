import { describe, it, expect } from 'vitest';
import {
    selectUpgradeCost,
    selectTierUpgradeCost,
    selectBaseProduction,
    selectBoosterBonus,
    selectClickPower,
    selectVisibleUpgrades,
} from '../selectors';
import { RootState } from '../../../lib/store';
import { Upgrade } from '../model';

describe('Upgrades Selectors', () => {
    describe('selectUpgradeCost', () => {
        it('should calculate cost without discount', () => {
            const cost = selectUpgradeCost(100, 0);
            expect(cost).toBe(100); // Premier achat
        });

        it('should calculate cost with exponential scaling', () => {
            const cost = selectUpgradeCost(100, 5);
            // 100 * (1.15 ^ 5) = 100 * 2.0113... = 201
            expect(cost).toBe(201);
        });

        it('should use cost override when provided', () => {
            const cost = selectUpgradeCost(100, 5, 150);
            expect(cost).toBe(150); // Discount appliqué
        });

        it('should handle owned = 0', () => {
            const cost = selectUpgradeCost(50, 0);
            expect(cost).toBe(50);
        });
    });

    describe('selectTierUpgradeCost', () => {
        it('should be 10x the normal cost', () => {
            const normalCost = selectUpgradeCost(100, 5);
            const tierCost = selectTierUpgradeCost(100, 5);
            expect(tierCost).toBe(normalCost * 10);
        });

        it('should respect cost override', () => {
            const tierCost = selectTierUpgradeCost(100, 5, 150);
            expect(tierCost).toBe(1500); // 150 * 10
        });
    });

    describe('selectBaseProduction', () => {
        it('should return 0 when no production upgrades', () => {
            const state: RootState = {
                upgrades: { available: [] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const production = selectBaseProduction(state);
            expect(production).toBe(0);
        });

        it('should calculate production with tier 0', () => {
            const upgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 1,
                owned: 5,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [upgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const production = selectBaseProduction(state);
            // 1 * (3^0) * 5 = 5
            expect(production).toBe(5);
        });

        it('should calculate production with tier 1', () => {
            const upgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 1,
                owned: 5,
                tier: 1,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [upgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const production = selectBaseProduction(state);
            // 1 * (3^1) * 5 = 15
            expect(production).toBe(15);
        });

        it('should ignore non-PRODUCTION upgrades', () => {
            const clickUpgrade: Upgrade = {
                id: 'click1',
                name: 'Click 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 5,
                owned: 3,
                tier: 0,
                color: '#fff',
                type: 'CLICK',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [clickUpgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const production = selectBaseProduction(state);
            expect(production).toBe(0);
        });
    });

    describe('selectBoosterBonus', () => {
        it('should return 0 when no boosters', () => {
            const state: RootState = {
                upgrades: { available: [] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const bonus = selectBoosterBonus(state);
            expect(bonus).toBe(0);
        });

        it('should calculate booster bonus with tier 0', () => {
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

            const state: RootState = {
                upgrades: { available: [booster] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const bonus = selectBoosterBonus(state);
            // 10 * (2^0) * 2 = 20%
            expect(bonus).toBe(20);
        });
    });

    describe('selectClickPower', () => {
        it('should return 1 when no click upgrades', () => {
            const state: RootState = {
                upgrades: { available: [] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const power = selectClickPower(state);
            expect(power).toBe(1); // Base click
        });

        it('should calculate click power with upgrades', () => {
            const clickUpgrade: Upgrade = {
                id: 'click1',
                name: 'Click 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 5,
                owned: 3,
                tier: 0,
                color: '#fff',
                type: 'CLICK',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [clickUpgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const power = selectClickPower(state);
            // 1 + (5 * 3^0 * 3) = 1 + 15 = 16
            expect(power).toBe(16);
        });
    });

    describe('selectVisibleUpgrades', () => {
        it('should show upgrades with unlockCost = 0', () => {
            const upgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 1,
                owned: 0,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [upgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const visible = selectVisibleUpgrades(state);
            expect(visible).toHaveLength(1);
            expect(visible[0].id).toBe('gen1');
        });

        it('should hide upgrades with unlockCost > totalGenerated', () => {
            const upgrade: Upgrade = {
                id: 'gen2',
                name: 'Gen 2',
                description: 'Test',
                baseCost: 500,
                baseProduction: 5,
                owned: 0,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 1000,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [upgrade] },
                resources: { energy: 0, totalGenerated: 500 },
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
            };

            const visible = selectVisibleUpgrades(state);
            expect(visible).toHaveLength(0);
        });

        it('should always show owned upgrades', () => {
            const upgrade: Upgrade = {
                id: 'gen2',
                name: 'Gen 2',
                description: 'Test',
                baseCost: 500,
                baseProduction: 5,
                owned: 1,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 1000,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [upgrade] },
                resources: { energy: 0, totalGenerated: 0 },
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
            };

            const visible = selectVisibleUpgrades(state);
            expect(visible).toHaveLength(1);
        });

        it('should filter by category', () => {
            const prodUpgrade: Upgrade = {
                id: 'gen1',
                name: 'Gen 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 1,
                owned: 0,
                tier: 0,
                color: '#fff',
                type: 'PRODUCTION',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const clickUpgrade: Upgrade = {
                id: 'click1',
                name: 'Click 1',
                description: 'Test',
                baseCost: 100,
                baseProduction: 5,
                owned: 0,
                tier: 0,
                color: '#fff',
                type: 'CLICK',
                unlockCost: 0,
                requiredAscension: 0,
            };

            const state: RootState = {
                upgrades: { available: [prodUpgrade, clickUpgrade] },
                resources: { energy: 0, totalGenerated: 0 },
                ui: {
                    floatingTexts: [],
                    isMobile: false,
                    activeMobileTab: 'REACTOR',
                    activeCategory: 'PRODUCTION',
                    lastPlasmaFlash: 0,
                },
                core: {
                    charge: 0,
                    status: 'CHARGING',
                    activeTimeRemaining: 0,
                    stats: { activations: 0 },
                },
            };

            const visible = selectVisibleUpgrades(state);
            expect(visible).toHaveLength(1);
            expect(visible[0].type).toBe('PRODUCTION');
        });
    });
});
