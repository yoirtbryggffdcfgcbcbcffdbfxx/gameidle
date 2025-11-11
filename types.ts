export interface Upgrade {
    id: string;
    name: string;
    baseCost: number;
    production: number;
    type: 'PRODUCTION' | 'CLICK' | 'BOOSTER';
    color: string;
    unlockCost: number;
    requiredAscension: number;
    owned: number;
    currentCost: number;
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

export type Theme = 'dark' | 'light' | 'matrix' | 'solaris' | 'cyberpunk';

export interface Settings {
    visualEffects: boolean;
    showFloatingText: boolean;
    animSpeed: number;
    scientificNotation: boolean;
    theme: Theme;
    sfxVolume: number;
    confirmAscension: boolean;
}

export interface Loan {
    amount: number;
    remaining: number;
}

export type QuantumPathType = 'RATE' | 'MULTIPLIER' | 'BALANCED';

export interface PathUpgrade {
    level: number;
    description: string;
    cost: number; // Cost in Quantum Shards
    effects: {
        rate?: number;
        multiplier?: number;
    };
}

export interface QuantumPath {
    name: string;
    description: string;
    upgrades: PathUpgrade[];
}


export interface GameState {
    energy: number;
    upgrades: Upgrade[];
    ascensionLevel: number;
    ascensionPoints: number;
    achievements: Achievement[];
    purchasedAscensionUpgrades: string[];
    // FIX: Add missing purchasedCoreUpgrades property to GameState.
    purchasedCoreUpgrades: string[];
    totalClicks: number;
    hasSeenAscensionTutorial: boolean;
    coreCharge: number;
    isCoreDischarging: boolean;
    quantumShards: number;
    hasSeenCoreTutorial: boolean;
    totalEnergyProduced: number;
    isBankUnlocked: boolean;
    savingsBalance: number;
    currentLoan: Loan | null;
    bankLevel: number;
    hasSeenBankTutorial: boolean;
    purchasedShopUpgrades: string[];
    productionHistory: number[];
    seenUpgrades: string[];
    viewedCategories: string[];
    isShopUnlocked: boolean;
    isCoreUnlocked: boolean;
    hasUnseenShopItems: boolean;
    
    // New Quantum Path system
    chosenQuantumPath: QuantumPathType | null;
    quantumPathLevel: number;
    hasInteractedWithQuantumCore: boolean;
}

export interface Particle {
    id: number;
    startX: number;
    startY: number;
    color: string;
}

export interface FloatingText {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

export interface Notification {
    id: number;
    message: string;
    type: 'achievement' | 'error' | 'info';
    title?: string;
    achievement?: Achievement;
}

export interface AscensionUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'PRODUCTION_MULTIPLIER' | 'CLICK_POWER_MULTIPLIER' | 'COST_REDUCTION' | 'STARTING_ENERGY';
        value: number;
    };
    required: string[];
    position: {
        angle: number;
        radius: number;
    };
}

// FIX: Add missing CoreUpgrade type to resolve import errors in other files.
export interface CoreUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'CORE_CHARGE_RATE' | 'CORE_BOOST_MULTIPLIER' | 'CORE_BOOST_DURATION';
        value: number;
    };
    required: string[];
    position: {
        angle: number;
        radius: number;
    };
}

export interface ShopUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: 'energy' | 'quantumShards';
    icon: string;
}