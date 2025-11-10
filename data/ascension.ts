import { AscensionUpgrade } from '../types';

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
    { id: 'start_1', name: 'Injection Initiale', description: 'Commencez avec 1000 énergie après une ascension.', cost: 2, effect: { type: 'STARTING_ENERGY', value: 1000 }, required: ['cost_1'], position: { angle: 210, radius: 2 } },
];
