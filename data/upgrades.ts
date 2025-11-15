import { Upgrade } from '../types';

// V5 Rebalance: Prices and production rebalanced for the new Tier system.
export const INITIAL_UPGRADES: Omit<Upgrade, 'owned' | 'currentCost' | 'tier'>[] = [
    // Génération
    { id: 'gen_1', name: 'Générateur de Particules Alpha', baseCost: 10, baseProduction: 1, type: 'PRODUCTION', color: '#00aaff', unlockCost: 0, requiredAscension: 0 },
    { id: 'gen_2', name: 'Faisceau de Muons Beta', baseCost: 80, baseProduction: 4, type: 'PRODUCTION', color: '#00ccff', unlockCost: 50, requiredAscension: 0 },
    { id: 'gen_3', name: 'Condensateur à Tau Gamma', baseCost: 900, baseProduction: 15, type: 'PRODUCTION', color: '#00e1ff', unlockCost: 1000, requiredAscension: 0 },
    { id: 'gen_4', name: 'Injecteur de Plasma Delta', baseCost: 10000, baseProduction: 60, type: 'PRODUCTION', color: '#33ffcc', unlockCost: 10000, requiredAscension: 0 },
    { id: 'gen_5', name: 'Réacteur à Neutrinos Epsilon', baseCost: 110000, baseProduction: 250, type: 'PRODUCTION', color: '#66ff99', unlockCost: 100000, requiredAscension: 0 },
    { id: 'gen_6', name: 'Forge Stellaire Zeta', baseCost: 1.2e6, baseProduction: 1000, type: 'PRODUCTION', color: '#99ff66', unlockCost: 1.2e6, requiredAscension: 0 },
    { id: 'gen_7', name: 'Matrice d\'Énergie Sombre Eta', baseCost: 1.5e7, baseProduction: 4000, type: 'PRODUCTION', color: '#ccff33', unlockCost: 1.5e7, requiredAscension: 0 },
    { id: 'gen_8', name: 'Collecteur Galactique Theta', baseCost: 2.5e8, baseProduction: 15000, type: 'PRODUCTION', color: '#ffff00', unlockCost: 2.5e8, requiredAscension: 0 },
    { id: 'gen_9', name: 'Puits Gravitationnel Iota', baseCost: 4e9, baseProduction: 60000, type: 'PRODUCTION', color: '#e6ff00', unlockCost: 4e9, requiredAscension: 0 },

    // Clic
    { id: 'click_1', name: 'Optimisation du Clic I', baseCost: 40, baseProduction: 1, type: 'CLICK', color: '#ff9900', unlockCost: 25, requiredAscension: 0 },
    { id: 'click_2', name: 'Algorithmes de Clic II', baseCost: 500, baseProduction: 5, type: 'CLICK', color: '#ff6600', unlockCost: 500, requiredAscension: 0 },
    { id: 'click_3', name: 'Prédiction Quantique III', baseCost: 6000, baseProduction: 20, type: 'CLICK', color: '#ff3300', unlockCost: 6000, requiredAscension: 0 },
    { id: 'click_4', name: 'Doigt de Dieu IV', baseCost: 8e5, baseProduction: 400, type: 'CLICK', color: '#ff0000', unlockCost: 8e5, requiredAscension: 0 },
    { id: 'click_5', name: 'Singularité Tactile V', baseCost: 1.2e7, baseProduction: 2000, type: 'CLICK', color: '#cc0000', unlockCost: 1.2e7, requiredAscension: 0 },

    // Boosters
    { id: 'boost_1', name: 'Amplificateur de Fréquence', baseCost: 40000, baseProduction: 5, type: 'BOOSTER', color: '#a855f7', unlockCost: 40000, requiredAscension: 0 },
    { id: 'boost_2', name: 'Optimiseur de Résonance', baseCost: 8e5, baseProduction: 10, type: 'BOOSTER', color: '#d946ef', unlockCost: 800000, requiredAscension: 0 },
    { id: 'boost_3', name: 'Harmoniseur de Dimensions', baseCost: 1.5e7, baseProduction: 15, type: 'BOOSTER', color: '#f026ef', unlockCost: 1.5e7, requiredAscension: 0 },

    // Ultimate
    { id: 'ultimate_1', name: 'Singularité Personnelle', baseCost: 1e11, baseProduction: 100000, type: 'PRODUCTION', color: '#ffffff', unlockCost: 1e10, requiredAscension: 0 },
];
