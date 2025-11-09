import { Upgrade, AscensionUpgrade, CoreUpgrade } from './types';

export const SAVE_KEY = 'quantum-core-idle-save';
export const TICK_RATE = 100; // ms per tick for production
export const CLICK_POWER = 1;
export const MAX_UPGRADE_LEVEL = 100;
export const CORE_CHARGE_RATE = 0.1; // charge per second
export const CORE_DISCHARGE_DURATION = 10000; // 10 seconds in ms

export const PARTICLE_COLORS = {
    CLICK: '#ffffff',
    BUY: '#ffdd00',
    ASCEND: '#cc00ff',
};

// Bank Constants
export const BANK_UNLOCK_TOTAL_ENERGY = 100000;
export const BANK_CONSTRUCTION_COST = 50000;
export const SAVINGS_INTEREST_RATE = 0.002; // 0.2% per second (Base Rate)
export const LOAN_INTEREST_RATE = 0.20; // 20% flat interest (Base Rate)
export const LOAN_REPAYMENT_RATE = 0.50; // 50% of income goes to repayment
export const LOAN_OPTIONS = [50000, 250000, 1000000];

export const BANK_UPGRADES = [
    // Level 0 (Base)
    { cost: 0, savingsInterest: 0.002, loanInterest: 0.20, description: "Taux d'épargne à 0.2%." },
    // Level 1
    { cost: 1e6, savingsInterest: 0.005, loanInterest: 0.20, description: "Améliore le taux d'épargne à 0.5%." },
    // Level 2
    { cost: 1e8, savingsInterest: 0.005, loanInterest: 0.15, description: "Réduit l'intérêt des prêts à 15%." },
    // Level 3
    { cost: 1e9, savingsInterest: 0.008, loanInterest: 0.15, description: "Améliore le taux d'épargne à 0.8%." }
];


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

// V5 Rebalance: Radial Skill Trees
export const ASCENSION_UPGRADES: AscensionUpgrade[] = [
    // Center
    { id: 'start', name: 'Point de Départ', description: 'Le début de votre voyage transcendant.', cost: 0, effect: { type: 'STARTING_ENERGY', value: 0 }, required: [], position: { angle: 0, radius: 0 } },

    // Ring 1: Main Branches
    { id: 'prod_1', name: 'Synergie', description: '+25% production.', cost: 1, effect: { type: 'PRODUCTION_MULTIPLIER', value: 0.25 }, required: ['start'], position: { angle: -90, radius: 1 } },
    { id: 'click_1', name: 'Résonance', description: '+50% puissance de clic.', cost: 1, effect: { type: 'CLICK_POWER_MULTIPLIER', value: 0.5 }, required: ['start'], position: { angle: 30, radius: 1 } },
    { id: 'cost_1', name: 'Efficacité', description: '-5% coût des améliorations.', cost: 1, effect: { type: 'COST_REDUCTION', value: 0.05 }, required: ['start'], position: { angle: 210, radius: 1 } },
    
    // Ring 2: Specialization
    { id: 'prod_2', name: 'Amplification', description: '+50% production.', cost: 3, effect: { type: 'PRODUCTION_MULTIPLIER', value: 0.5 }, required: ['prod_1'], position: { angle: -90, radius: 2 } },
    { id: 'click_2', name: 'Focalisation', description: 'Double la puissance de clic.', cost: 3, effect: { type: 'CLICK_POWER_MULTIPLIER', value: 1 }, required: ['click_1'], position: { angle: 30, radius: 2 } },
    // FIX: Complete the truncated AscensionUpgrade object that was causing a type error.
    { id: 'start_1', name: 'Injection Initiale', description: 'Commencez avec 1000 énergie après une ascension.', cost: 2, effect: { type: 'STARTING_ENERGY', value: 1000 }, required: ['cost_1'], position: { angle: 210, radius: 2 } },
];

// FIX: Add the missing CORE_UPGRADES constant to resolve import errors in useGameState and ReactorSection.
export const CORE_UPGRADES: CoreUpgrade[] = [
    // Center
    { id: 'core_start', name: 'Noyau Actif', description: 'Le cœur quantique est en ligne.', cost: 0, effect: { type: 'CORE_CHARGE_RATE', value: 0 }, required: [], position: { angle: 0, radius: 0 } },

    // Ring 1
    { id: 'core_charge_1', name: 'Charge Accélérée', description: 'Augmente la vitesse de charge de 25%.', cost: 1, effect: { type: 'CORE_CHARGE_RATE', value: 0.25 }, required: ['core_start'], position: { angle: -90, radius: 1 } },
    { id: 'core_boost_1', name: 'Surcharge Améliorée', description: 'Augmente le multiplicateur de boost de +1x.', cost: 1, effect: { type: 'CORE_BOOST_MULTIPLIER', value: 1 }, required: ['core_start'], position: { angle: 30, radius: 1 } },
    { id: 'core_duration_1', name: 'Stabilité Prolongée', description: 'Augmente la durée du boost de 2 secondes.', cost: 1, effect: { type: 'CORE_BOOST_DURATION', value: 2000 }, required: ['core_start'], position: { angle: 210, radius: 1 } },

    // Ring 2
    { id: 'core_charge_2', name: 'Flux Turbulent', description: 'Augmente la vitesse de charge de 50%.', cost: 3, effect: { type: 'CORE_CHARGE_RATE', value: 0.5 }, required: ['core_charge_1'], position: { angle: -90, radius: 2 } },
    { id: 'core_boost_2', name: 'Éruption Quantique', description: 'Augmente le multiplicateur de boost de +2.5x.', cost: 3, effect: { type: 'CORE_BOOST_MULTIPLIER', value: 2.5 }, required: ['core_boost_1'], position: { angle: 30, radius: 2 } },
    { id: 'core_duration_2', name: 'Ancrage Temporel', description: 'Augmente la durée du boost de 3 secondes.', cost: 3, effect: { type: 'CORE_BOOST_DURATION', value: 3000 }, required: ['core_duration_1'], position: { angle: 210, radius: 2 } },
];
