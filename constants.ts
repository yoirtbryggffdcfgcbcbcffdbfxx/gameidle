import { Upgrade, Achievement, PrestigeUpgrade } from './types';

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
  { name: 'Sphère de Dyson', baseCost: 50000, production: 4000, owned: 0, color: '#ffd700' },
  { name: 'Singularité Énergétique', baseCost: 250000, production: 15000, owned: 0, color: '#9933ff' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { name: "Premier Clic", unlocked: false, description: "Collecter votre premier point d'énergie." },
  { name: "Premier Achat", unlocked: false, description: "Acheter votre première amélioration." },
  { name: "Collectionneur", unlocked: false, description: "Posséder un total de 10 améliorations." },
  { name: "Magnat", unlocked: false, description: "Posséder un total de 50 améliorations." },
  { name: "Empereur Industriel", unlocked: false, description: "Posséder un total de 200 améliorations." },
  { name: "Milliardaire en Énergie", unlocked: false, description: "Atteindre 100 points d'énergie." },
  { name: "Magnat de l'Énergie", unlocked: false, description: "Atteindre 1,000 points d'énergie." },
  { name: "Divinité Énergétique", unlocked: false, description: "Atteindre 10,000 points d'énergie." },
  { name: "Début de Production", unlocked: false, description: "Atteindre une production de 10/sec." },
  { name: "Automatisation", unlocked: false, description: "Atteindre une production de 100/sec." },
  { name: "Puissance Industrielle", unlocked: false, description: "Atteindre une production de 1,000/sec." },
  { name: "Singularité Productive", unlocked: false, description: "Atteindre une production de 10,000/sec." },
  { name: "Première Prestige", unlocked: false, description: "Atteindre votre première prestige." },
  { name: "Prestigieux", unlocked: false, description: "Atteindre le niveau de prestige 5." },
  { name: "Légende du Prestige", unlocked: false, description: "Atteindre le niveau de prestige 25." },
];

export const PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
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
        description: 'Commencez avec 50 points d\'énergie après un prestige.',
        cost: 2,
        effect: { type: 'STARTING_ENERGY', value: 50 }
    },
];