
import { Upgrade } from '../types';

// V9 Rebalance: "The Tier Investment Strategy"
// Suite à l'analyse du coût complet pour atteindre le premier palier (x3),
// les valeurs de production ont été augmentées significativement (Gen 3 à 9)
// pour garantir que l'investissement massif (~60x le prix de base) soit ressenti comme rentable.

export const INITIAL_UPGRADES: Omit<Upgrade, 'owned' | 'currentCost' | 'tier'>[] = [
    // Génération
    { 
        id: 'gen_1', 
        name: 'Générateur de Particules Alpha', 
        baseCost: 15, 
        baseProduction: 1,
        type: 'PRODUCTION', 
        color: '#00aaff', 
        unlockCost: 0, 
        requiredAscension: 0 
    },
    { 
        id: 'gen_2', 
        name: 'Faisceau de Muons Beta', 
        baseCost: 100, 
        baseProduction: 5, 
        type: 'PRODUCTION', 
        color: '#00ccff', 
        unlockCost: 75, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_1'
    },
    { 
        id: 'gen_3', 
        name: 'Condensateur à Tau Gamma', 
        baseCost: 1100, 
        baseProduction: 32, 
        type: 'PRODUCTION', 
        color: '#00e1ff', 
        unlockCost: 825, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_2'
    },
    { 
        id: 'gen_4', 
        name: 'Injecteur de Plasma Delta', 
        baseCost: 12000, 
        baseProduction: 220, 
        type: 'PRODUCTION', 
        color: '#33ffcc', 
        unlockCost: 9000, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_3'
    },
    { 
        id: 'gen_5', 
        name: 'Réacteur à Neutrinos Epsilon', 
        baseCost: 130000, 
        baseProduction: 1100, 
        type: 'PRODUCTION', 
        color: '#66ff99', 
        unlockCost: 97500, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_4'
    },
    { 
        id: 'gen_6', 
        name: 'Forge Stellaire Zeta', 
        baseCost: 1.4e6, 
        baseProduction: 6500, 
        type: 'PRODUCTION', 
        color: '#99ff66', 
        unlockCost: 1050000, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_5'
    },
    { 
        id: 'gen_7', 
        name: 'Matrice d\'Énergie Sombre Eta', 
        baseCost: 20e6, 
        baseProduction: 55000, 
        type: 'PRODUCTION', 
        color: '#ccff33', 
        unlockCost: 15000000, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_6'
    },
    { 
        id: 'gen_8', 
        name: 'Collecteur Galactique Theta', 
        baseCost: 300e6, 
        baseProduction: 450000, 
        type: 'PRODUCTION', 
        color: '#ffff00', 
        unlockCost: 225e6, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_7'
    },
    { 
        id: 'gen_9', 
        name: 'Puits Gravitationnel Iota', 
        baseCost: 5e9, 
        baseProduction: 3500000, 
        type: 'PRODUCTION', 
        color: '#e6ff00', 
        unlockCost: 3.75e9, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_8'
    },

    // Clic - V4 Rebalance: "Active Overdrive"
    // Boost significatif pour compenser le coût des seuils et récompenser le jeu actif.
    { 
        id: 'click_1', 
        name: 'Optimisation du Clic I', 
        baseCost: 25,
        baseProduction: 1,
        type: 'CLICK', 
        color: '#ff9900', 
        unlockCost: 15, 
        requiredAscension: 0 
    },
    { 
        id: 'click_2', 
        name: 'Algorithmes de Clic II', 
        baseCost: 250,
        baseProduction: 5, 
        type: 'CLICK', 
        color: '#ff6600', 
        unlockCost: 185, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_1'
    },
    { 
        id: 'click_3', 
        name: 'Prédiction Quantique III', 
        baseCost: 5000,
        baseProduction: 140, // Up from 85
        type: 'CLICK', 
        color: '#ff3300', 
        unlockCost: 3750, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_2'
    },
    { 
        id: 'click_4', 
        name: 'Doigt de Dieu IV', 
        baseCost: 150000,
        baseProduction: 4500, // Up from 2500
        type: 'CLICK', 
        color: '#ff0000', 
        unlockCost: 112500, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_3'
    },
    { 
        id: 'click_5', 
        name: 'Singularité Tactile V', 
        baseCost: 3.5e6, 
        baseProduction: 120000, // Up from 65000
        type: 'CLICK', 
        color: '#cc0000', 
        unlockCost: 2625000, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_4'
    },
    { 
        id: 'click_6', 
        name: 'Résonance Neuronale VI', 
        baseCost: 80e6, 
        baseProduction: 1800000, // Up from 850000
        type: 'CLICK', 
        color: '#990000', 
        unlockCost: 60000000, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_5'
    },
    { 
        id: 'click_7', 
        name: 'Main de l\'Architecte VII', 
        baseCost: 2.5e9, 
        baseProduction: 24000000, // Up from 12M. 
        type: 'CLICK', 
        color: '#660000', 
        unlockCost: 1.8e9, 
        requiredAscension: 0,
        requiredUpgradeId: 'click_6'
    },

    // Boosters - V5 Rebalance: "Exponential Scaling"
    // Passage de valeurs faibles à des valeurs significatives,
    // car le multiplicateur de Tier est maintenant x2 (Exponentiel) au lieu de +50% (Additif).
    { 
        id: 'boost_1', 
        name: 'Amplificateur de Fréquence', 
        baseCost: 25000, 
        baseProduction: 5, 
        type: 'BOOSTER', 
        color: '#a855f7', 
        unlockCost: 18750, 
        requiredAscension: 0 
    },
    { 
        id: 'boost_2', 
        name: 'Optimiseur de Résonance', 
        baseCost: 5e6, 
        baseProduction: 20, // Up from 10
        type: 'BOOSTER', 
        color: '#d946ef', 
        unlockCost: 3750000, 
        requiredAscension: 0,
        requiredUpgradeId: 'boost_1'
    },
    { 
        id: 'boost_3', 
        name: 'Harmoniseur de Dimensions', 
        baseCost: 1e9, 
        baseProduction: 50, // Up from 15. Huge buff for late game.
        type: 'BOOSTER', 
        color: '#f026ef', 
        unlockCost: 750000000, 
        requiredAscension: 0,
        requiredUpgradeId: 'boost_2'
    },
    
    // Cadeau (Standalone)
    { 
        id: 'boost_gift_1', 
        name: 'Condensateur de Chance', 
        baseCost: 15000, 
        baseProduction: 0, 
        type: 'BOOSTER', 
        color: '#22d3ee', 
        unlockCost: 11250, 
        requiredAscension: 0 
    },

    // Ultimate
    { 
        id: 'ultimate_1', 
        name: 'Singularité Personnelle', 
        baseCost: 1e11, 
        baseProduction: 45e6, 
        type: 'PRODUCTION', 
        color: '#ffffff', 
        unlockCost: 75e9, 
        requiredAscension: 0,
        requiredUpgradeId: 'gen_9'
    },
];