import { CoreUpgrade } from '../types';

export const CORE_UNLOCK_TOTAL_ENERGY = 100000;

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