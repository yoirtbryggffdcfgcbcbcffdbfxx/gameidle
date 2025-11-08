
import { Upgrade, Achievement } from './types';

export const MAX_ENERGY = 10000;
export const CLICK_POWER = 1;
export const SAVE_KEY = 'reactIdleGameSave';

export const INITIAL_UPGRADES: Omit<Upgrade, 'currentCost'>[] = [
  { name: 'Petit Générateur', baseCost: 10, production: 1, owned: 0, color: '#ff4444' },
  { name: 'Machine Puissante', baseCost: 50, production: 5, owned: 0, color: '#44ff44' },
  { name: 'Station Avancée', baseCost: 200, production: 20, owned: 0, color: '#4444ff' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { name: "Premier Clic", unlocked: false, description: "Collect your first energy point." },
  { name: "Premier Achat", unlocked: false, description: "Buy your first upgrade." },
  { name: "Collectionneur", unlocked: false, description: "Own a total of 10 upgrades." },
  { name: "Première Prestige", unlocked: false, description: "Achieve your first prestige." },
];