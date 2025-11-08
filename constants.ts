
import { Upgrade, Achievement } from './types';

export const MAX_ENERGY = 10000;
export const CLICK_POWER = 1;
export const SAVE_KEY = 'reactIdleGameSave';

export const PARTICLE_COLORS = {
    CLICK: '#00ffcc',
    BUY: '#ffff00',
};

export const INITIAL_UPGRADES: Omit<Upgrade, 'currentCost'>[] = [
  { name: 'Petit Générateur', baseCost: 10, production: 1, owned: 0, color: '#ff4444' },
  { name: 'Machine Puissante', baseCost: 50, production: 5, owned: 0, color: '#44ff44' },
  { name: 'Station Avancée', baseCost: 200, production: 20, owned: 0, color: '#4444ff' },
  { name: 'Complexe Industriel', baseCost: 1000, production: 100, owned: 0, color: '#ff9900' },
  { name: 'Centrale Nucléaire', baseCost: 8000, production: 750, owned: 0, color: '#00ffff' },
  { name: 'Sphère de Dyson', baseCost: 50000, production: 4000, owned: 0, color: '#f0f0f0' },
  { name: 'Singularité Énergétique', baseCost: 250000, production: 15000, owned: 0, color: '#9933ff' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { name: "Premier Clic", unlocked: false, description: "Collect your first energy point." },
  { name: "Premier Achat", unlocked: false, description: "Buy your first upgrade." },
  { name: "Collectionneur", unlocked: false, description: "Own a total of 10 upgrades." },
  { name: "Première Prestige", unlocked: false, description: "Achieve your first prestige." },
];