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
    { id: 'start_1', name: 'Démarrage Rapide', description: 'Commence avec 1000 énergie.', cost: 2, effect: { type: 'STARTING_ENERGY', value: 1000 }, required: ['cost_1'], position: { angle: 210, radius: 2 } },

    // Ring 3: Advanced Branches
    { id: 'prod_3_scaling', name: 'Distorsion', description: '+10% production par niveau d\'ascension.', cost: 5, effect: { type: 'PRODUCTION_MULTIPLIER', value: 0.1 }, required: ['prod_2'], position: { angle: -120, radius: 3 } },
    { id: 'prod_4_flat', name: 'Surcharge', description: '+100% production.', cost: 5, effect: { type: 'PRODUCTION_MULTIPLIER', value: 1.0 }, required: ['prod_2'], position: { angle: -60, radius: 3 } },
    { id: 'click_3_scaling', name: 'Singularité', description: '+50% clic par niveau d\'ascension.', cost: 5, effect: { type: 'CLICK_POWER_MULTIPLIER', value: 0.5 }, required: ['click_2'], position: { angle: 0, radius: 3 } },
    { id: 'click_4_flat', name: 'Impact', description: 'Triple la puissance de clic.', cost: 5, effect: { type: 'CLICK_POWER_MULTIPLIER', value: 2.0 }, required: ['click_2'], position: { angle: 60, radius: 3 } },
    { id: 'cost_2', name: 'Optimisation', description: 'Encore -5% coût.', cost: 4, effect: { type: 'COST_REDUCTION', value: 0.05 }, required: ['start_1'], position: { angle: 180, radius: 3 } },
    { id: 'cost_3', name: 'Automatisation', description: 'Encore -5% coût.', cost: 4, effect: { type: 'COST_REDUCTION', value: 0.05 }, required: ['start_1'], position: { angle: 240, radius: 3 } },
];

export const CORE_UPGRADES: CoreUpgrade[] = [
    // Center
    { id: 'core_start', name: 'Noyau Actif', description: 'Le Cœur Quantique est prêt.', cost: 0, effect: { type: 'CORE_CHARGE_RATE', value: 0 }, required: [], position: { angle: 0, radius: 0 } },
    
    // Ring 1
    { id: 'core_charge_1', name: 'Canalisation', description: '+25% vitesse de charge.', cost: 1, effect: { type: 'CORE_CHARGE_RATE', value: 0.25 }, required: ['core_start'], position: { angle: -90, radius: 1 } },
    { id: 'core_boost_1', name: 'Intensificateur', description: '+50% puissance de boost.', cost: 1, effect: { type: 'CORE_BOOST_MULTIPLIER', value: 0.5 }, required: ['core_start'], position: { angle: 30, radius: 1 } },
    { id: 'core_duration_1', name: 'Stabilisateur', description: '+2s durée de boost.', cost: 1, effect: { type: 'CORE_BOOST_DURATION', value: 2000 }, required: ['core_start'], position: { angle: 210, radius: 1 } },
    
    // Ring 2
    { id: 'core_charge_2', name: 'Flux Accéléré', description: 'Encore +50% vitesse de charge.', cost: 3, effect: { type: 'CORE_CHARGE_RATE', value: 0.5 }, required: ['core_charge_1'], position: { angle: -90, radius: 2 } },
    { id: 'core_boost_2', name: 'Fusion', description: 'Encore +100% puissance de boost.', cost: 3, effect: { type: 'CORE_BOOST_MULTIPLIER', value: 1.0 }, required: ['core_boost_1'], position: { angle: 30, radius: 2 } },
    { id: 'core_duration_2', name: 'Champ de Stase', description: 'Encore +3s durée de boost.', cost: 3, effect: { type: 'CORE_BOOST_DURATION', value: 3000 }, required: ['core_duration_1'], position: { angle: 210, radius: 2 } },

    // Ring 3 - Capstones
    { id: 'core_charge_3', name: 'Afflux Infini', description: 'Double la vitesse de charge de base.', cost: 5, effect: { type: 'CORE_CHARGE_RATE', value: 1.0 }, required: ['core_charge_2'], position: { angle: -90, radius: 3 } },
    { id: 'core_boost_3', name: 'Singularité', description: 'Triple la puissance de boost de base.', cost: 5, effect: { type: 'CORE_BOOST_MULTIPLIER', value: 2.0 }, required: ['core_boost_2'], position: { angle: 30, radius: 3 } },
    { id: 'core_duration_3', name: 'Éternité', description: '+5s durée de boost.', cost: 5, effect: { type: 'CORE_BOOST_DURATION', value: 5000 }, required: ['core_duration_2'], position: { angle: 210, radius: 3 } },
];