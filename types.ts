export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  production: number; // Represents production/sec for PRODUCTION, +click power for CLICK, and % bonus for BOOSTER
  owned: number;
  color: string;
  currentCost: number;
  type: 'PRODUCTION' | 'CLICK' | 'BOOSTER';
  unlockCost: number;
  requiredAscension: number;
}

export interface Achievement {
  name: string;
  unlocked: boolean;
  description: string;
  hidden: boolean;
  bonus: {
      type: 'PRODUCTION' | 'CLICK' | 'CORE_CHARGE' | 'COST_REDUCTION';
      value: number; // Percentage value
  };
  relatedUpgradeName?: string;
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
    position: { angle: number, radius: number };
}

export interface CoreUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'CORE_BOOST_MULTIPLIER' | 'CORE_CHARGE_RATE' | 'CORE_BOOST_DURATION';
        value: number;
    };
    required: string[];
    position: { angle: number, radius: number };
}

export interface ShopUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: 'quantumShards' | 'energy';
    icon: string;
}

export interface GameState {
  energy: number;
  upgrades: Upgrade[];
  ascensionLevel: number;
  ascensionPoints: number;
  achievements: Achievement[];
  purchasedAscensionUpgrades: string[];
  totalClicks: number;
  hasSeenAscensionTutorial: boolean;
  coreCharge: number;
  isCoreDischarging: boolean;
  quantumShards: number;
  purchasedCoreUpgrades: string[];
  hasSeenCoreTutorial: boolean;
  // Bank feature state
  totalEnergyProduced: number;
  isBankUnlocked: boolean;
  savingsBalance: number;
  currentLoan: { amount: number; remaining: number; } | null;
  bankLevel: number;
  hasSeenBankTutorial: boolean;
  // Shop feature state
  purchasedShopUpgrades: string[];
  // New state for advanced metrics
  productionHistory: number[];
}

export interface Settings {
    visualEffects: boolean;
    showFloatingText: boolean;
    animSpeed: number;
    scientificNotation: boolean;
    theme: 'dark' | 'light' | 'matrix' | 'solaris' | 'cyberpunk';
    sfxVolume: number; // 0 to 1
    confirmAscension: boolean;
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
    type: 'info' | 'error' | 'achievement';
    message: string;
    title?: string;
    achievement?: Achievement;
}