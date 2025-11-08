import { Upgrade, Achievement, AscensionUpgrade, CoreUpgrade } from './types';

export const CLICK_POWER = 1;
export const SAVE_KEY = 'reactIdleGameSave';
export const MAX_UPGRADE_LEVEL = 100;

export const CORE_CHARGE_RATE = 0.25; // 0.25% per second (slower initial charge)
export const CORE_DISCHARGE_DURATION = 10000; // 10 seconds in ms
export const CORE_PRODUCTION_MULTIPLIER = 2; // Base multiplier is now x2

export const PARTICLE_COLORS = {
    CLICK: '#00ffcc',
    BUY: '#ffff00',
};

export const INITIAL_UPGRADES: Omit<Upgrade, 'currentCost'>[] = [
  { id: 'gen_1', name: 'Petit Générateur', baseCost: 10, production: 1, owned: 0, color: '#00b4d8', type: 'PRODUCTION', unlockCost: 0, requiredAscension: 0 },
  { id: 'click_1', name: 'Pointeur Quantique', baseCost: 20, production: 1, owned: 0, color: '#00f5d4', type: 'CLICK', unlockCost: 10, requiredAscension: 0 },
  { id: 'gen_2', name: 'Machine Puissante', baseCost: 100, production: 8, owned: 0, color: '#06d6a0', type: 'PRODUCTION', unlockCost: 50, requiredAscension: 0 },
  { id: 'gen_3', name: 'Station Avancée', baseCost: 600, production: 40, owned: 0, color: '#90be6d', type: 'PRODUCTION', unlockCost: 300, requiredAscension: 0 },
  { id: 'gen_4', name: 'Complexe Industriel', baseCost: 4500, production: 250, owned: 0, color: '#f9c74f', type: 'PRODUCTION', unlockCost: 2000, requiredAscension: 0 },
  
  { id: 'gen_5', name: 'Centrale Nucléaire', baseCost: 30000, production: 1500, owned: 0, color: '#f8961e', type: 'PRODUCTION', unlockCost: 12500, requiredAscension: 1 },
  { id: 'gen_6', name: 'Sphère de Dyson', baseCost: 200000, production: 10000, owned: 0, color: '#f3722c', type: 'PRODUCTION', unlockCost: 90000, requiredAscension: 1 },
  { id: 'gen_7', name: 'Singularité Énergétique', baseCost: 1500000, production: 65000, owned: 0, color: '#f94144', type: 'PRODUCTION', unlockCost: 600000, requiredAscension: 1 },
  
  { id: 'gen_8', name: 'Extracteur de Trou Noir', baseCost: 11000000, production: 450000, owned: 0, color: '#f000b8', type: 'PRODUCTION', unlockCost: 4500000, requiredAscension: 2 },
  { id: 'gen_9', name: 'Forge Stellaire', baseCost: 85000000, production: 3000000, owned: 0, color: '#a200ff', type: 'PRODUCTION', unlockCost: 35000000, requiredAscension: 2 },
  
  { id: 'gen_10', name: 'Collecteur Galactique', baseCost: 600000000, production: 20000000, owned: 0, color: '#ffffff', type: 'PRODUCTION', unlockCost: 250000000, requiredAscension: 3 },
];

export const ASCENSION_UPGRADES: AscensionUpgrade[] = [
    {
        id: 'click_mult_1',
        name: 'Clics Améliorés',
        description: 'Augmente la puissance des clics de 100%.',
        cost: 1,
        effect: { type: 'CLICK_POWER_MULTIPLIER', value: 2 }
    },
    {
        id: 'prod_mult_1',
        name: 'Production Efficace',
        description: 'Augmente toute la production de 25%.',
        cost: 1,
        effect: { type: 'PRODUCTION_MULTIPLIER', value: 1.25 }
    },
    {
        id: 'cost_reduc_1',
        name: 'Ingénierie à Bas Coût',
        description: 'Réduit le coût de toutes les améliorations de 10%.',
        cost: 2,
        effect: { type: 'COST_REDUCTION', value: 0.9 }
    },
    {
        id: 'start_energy_1',
        name: 'Démarrage Rapide',
        description: 'Commencez avec 50 points d\'énergie après une ascension.',
        cost: 2,
        effect: { type: 'STARTING_ENERGY', value: 50 }
    },
];

export const CORE_UPGRADES: CoreUpgrade[] = [
    {
        id: 'core_charge_1',
        name: 'Condensateurs Améliorés',
        description: 'Augmente la vitesse de charge du Cœur de +0.05%/s.',
        cost: 1,
        effect: { type: 'CORE_CHARGE_RATE', value: 0.05 }
    },
    {
        id: 'core_boost_1',
        name: 'Efficacité du Cœur I',
        description: 'Augmente le multiplicateur du Cœur Quantique de +0.2.',
        cost: 1,
        effect: { type: 'CORE_BOOST_MULTIPLIER', value: 0.2 }
    },
    {
        id: 'core_charge_2',
        name: 'Injecteurs de Plasma',
        description: 'Augmente la vitesse de charge du Cœur de +0.05%/s.',
        cost: 2,
        effect: { type: 'CORE_CHARGE_RATE', value: 0.05 }
    },
    {
        id: 'core_boost_2',
        name: 'Efficacité du Cœur II',
        description: 'Augmente le multiplicateur du Cœur Quantique de +0.2.',
        cost: 2,
        effect: { type: 'CORE_BOOST_MULTIPLIER', value: 0.2 }
    },
    {
        id: 'core_charge_3',
        name: 'Synchronisation Temporelle',
        description: 'Augmente la vitesse de charge du Cœur de +0.1%/s.',
        cost: 3,
        effect: { type: 'CORE_CHARGE_RATE', value: 0.1 }
    },
    {
        id: 'core_boost_3',
        name: 'Efficacité du Cœur III',
        description: 'Augmente le multiplicateur du Cœur Quantique de +0.2.',
        cost: 3,
        effect: { type: 'CORE_BOOST_MULTIPLIER', value: 0.2 }
    },
];