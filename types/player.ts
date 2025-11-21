
export interface Upgrade {
    id: string;
    name: string;
    baseCost: number;
    baseProduction: number;
    tier: number;
    type: 'PRODUCTION' | 'CLICK' | 'BOOSTER';
    color: string;
    unlockCost: number;
    requiredAscension: number;
    requiredUpgradeId?: string;
    owned: number;
    currentCost: number;
    nextLevelCostOverride?: number;
}

export interface Achievement {
    name: string;
    unlocked: boolean;
    hidden: boolean;
    description: string;
    bonus: {
        type: 'PRODUCTION' | 'CLICK' | 'CORE_CHARGE' | 'COST_REDUCTION';
        value: number;
    };
    relatedUpgradeName?: string;
}
