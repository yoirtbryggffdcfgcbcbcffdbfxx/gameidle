import { Upgrade } from '../types';

// V4 Rebalance: Drastically reduced production and re-adjusted costs for a smoother Ascension 0 curve.
export const INITIAL_UPGRADES: Omit<Upgrade, 'owned' | 'currentCost'>[] = [
    // Génération
    { id: 'gen_1', name: 'Générateur de Particules Alpha', baseCost: 15, production: 1, type: 'PRODUCTION', color: '#00aaff', unlockCost: 0, requiredAscension: 0 },
    { id: 'gen_2', name: 'Faisceau de Muons Beta', baseCost: 100, production: 5, type: 'PRODUCTION', color: '#00ccff', unlockCost: 50, requiredAscension: 0 },
    { id: 'gen_3', name: 'Condensateur à Tau Gamma', baseCost: 1100, production: 20, type: 'PRODUCTION', color: '#00e1ff', unlockCost: 1000, requiredAscension: 0 },
    { id: 'gen_4', name: 'Injecteur de Plasma Delta', baseCost: 12000, production: 80, type: 'PRODUCTION', color: '#33ffcc', unlockCost: 10000, requiredAscension: 0 },
    { id: 'gen_5', name: 'Réacteur à Neutrinos Epsilon', baseCost: 130000, production: 320, type: 'PRODUCTION', color: '#66ff99', unlockCost: 100000, requiredAscension: 1 },
    { id: 'gen_6', name: 'Forge Stellaire Zeta', baseCost: 1.4e6, production: 1200, type: 'PRODUCTION', color: '#99ff66', unlockCost: 1.2e6, requiredAscension: 2 },
    { id: 'gen_7', name: 'Matrice d\'Énergie Sombre Eta', baseCost: 2e7, production: 5000, type: 'PRODUCTION', color: '#ccff33', unlockCost: 1.5e7, requiredAscension: 3 },
    { id: 'gen_8', name: 'Collecteur Galactique Theta', baseCost: 3.3e8, production: 20000, type: 'PRODUCTION', color: '#ffff00', unlockCost: 2.5e8, requiredAscension: 5 },

    // Clic
    { id: 'click_1', name: 'Optimisation du Clic I', baseCost: 50, production: 1, type: 'CLICK', color: '#ff9900', unlockCost: 25, requiredAscension: 0 },
    { id: 'click_2', name: 'Algorithmes de Clic II', baseCost: 600, production: 5, type: 'CLICK', color: '#ff6600', unlockCost: 500, requiredAscension: 0 },
    { id: 'click_3', name: 'Prédiction Quantique III', baseCost: 7500, production: 25, type: 'CLICK', color: '#ff3300', unlockCost: 6000, requiredAscension: 1 },
    { id: 'click_4', name: 'Doigt de Dieu IV', baseCost: 1e6, production: 500, type: 'CLICK', color: '#ff0000', unlockCost: 8e5, requiredAscension: 3 },

    // Boosters
    { id: 'boost_1', name: 'Amplificateur de Fréquence', baseCost: 50000, production: 5, type: 'BOOSTER', color: '#a855f7', unlockCost: 40000, requiredAscension: 0 },
    { id: 'boost_2', name: 'Optimiseur de Résonance', baseCost: 1e6, production: 10, type: 'BOOSTER', color: '#d946ef', unlockCost: 800000, requiredAscension: 1 },

    // Ultimate
    { id: 'ultimate_1', name: 'Singularité Personnelle', baseCost: 1e11, production: 100000, type: 'PRODUCTION', color: '#ffffff', unlockCost: 1e10, requiredAscension: 10 },
];
