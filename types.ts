export interface Upgrade {
  name: string;
  baseCost: number;
  production: number;
  owned: number;
  color: string;
  currentCost: number;
}

export interface Achievement {
  name: string;
  unlocked: boolean;
  description: string;
}

export interface PrestigeUpgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'CLICK_POWER_MULTIPLIER' | 'PRODUCTION_MULTIPLIER' | 'COST_REDUCTION' | 'STARTING_ENERGY';
        value: number;
    };
}

export interface GameState {
  energy: number;
  upgrades: Upgrade[];
  prestigeCount: number;
  achievements: Achievement[];
  purchasedPrestigeUpgrades: string[];
}

export interface Settings {
    visualEffects: boolean;
    animSpeed: number;
    scientificNotation: boolean;
    theme: 'dark' | 'light' | 'matrix' | 'solaris' | 'cyberpunk';
    sfxVolume: number; // 0 to 1
    confirmPrestige: boolean;
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

export interface NotificationState {
    text: string;
    show: boolean;
    type?: 'default' | 'achievement' | 'error';
}