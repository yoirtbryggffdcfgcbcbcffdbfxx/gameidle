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

export interface GameState {
  energy: number;
  upgrades: Upgrade[];
  prestigeCount: number;
  achievements: Achievement[];
}

export interface Settings {
    visualEffects: boolean;
    animSpeed: number;
    scientificNotation: boolean;
    theme: 'dark' | 'light';
    sfxVolume: number; // 0 to 1
}

export interface Particle {
    id: number;
    startX: number;
    startY: number;
    color: string;
}