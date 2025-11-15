/**
 * Définit les coûts en énergie pour les premiers Fragments Quantiques.
 */
export const FRAGMENT_COST_STAGES: number[] = [
    5e4,    // 1er
    15e4,   // 2e
    25e4,   // 3e
    40e4,   // 4e
    60e4,   // 5e
    90e4,   // 6e
    1.3e6,  // 7e
    1.7e6,  // 8e
    2.3e6,  // 9e
    3e6,    // 10e
    4e6,    // 11e
    6e6,    // 12e
    9e6,    // 13e
    1.3e7,  // 14e
];

/**
 * Calcule le coût du prochain Fragment Quantique en fonction du nombre déjà possédé.
 * @param shardsOwned Le nombre de fragments que le joueur possède actuellement.
 * @returns Le coût en énergie pour le prochain fragment.
 */
export const getNextFragmentCost = (shardsOwned: number): number => {
    if (shardsOwned < FRAGMENT_COST_STAGES.length) {
        return FRAGMENT_COST_STAGES[shardsOwned];
    }
    
    // Pour les fragments au-delà de la liste, la logique est additive avec un pas qui augmente.
    // L'incrément de 9M à 13M est de 4M. Chaque nouvel incrément augmente de 1M.
    let currentCost = FRAGMENT_COST_STAGES[FRAGMENT_COST_STAGES.length - 1]; // 13,000,000
    let currentIncrement = 4000000; // Le pas qui a mené au dernier coût défini.
    const stagesBeyond = shardsOwned - (FRAGMENT_COST_STAGES.length - 1);

    for (let i = 0; i < stagesBeyond; i++) {
        currentIncrement += 1000000;
        currentCost += currentIncrement;
    }

    return currentCost;
};