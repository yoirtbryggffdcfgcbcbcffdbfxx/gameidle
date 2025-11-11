/**
 * Définit les coûts en énergie pour les premiers Fragments Quantiques.
 */
export const FRAGMENT_COST_STAGES: number[] = [
    5e3,    // 1er
    15e3,   // 2e
    25e3,   // 3e
    40e3,   // 4e
    60e3,   // 5e
    90e3,   // 6e
    130e3,  // 7e
    170e3,  // 8e
    230e3,  // 9e
    300e3,  // 10e
    400e3,  // 11e
    600e3,  // 12e
    900e3,  // 13e
    1.3e6,  // 14e
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
    // L'incrément de 900k à 1.3M est de 400k. Chaque nouvel incrément augmente de 100k.
    let currentCost = FRAGMENT_COST_STAGES[FRAGMENT_COST_STAGES.length - 1]; // 1,300,000
    let currentIncrement = 400000; // Le pas qui a mené au dernier coût défini.
    const stagesBeyond = shardsOwned - (FRAGMENT_COST_STAGES.length - 1);

    for (let i = 0; i < stagesBeyond; i++) {
        currentIncrement += 100000;
        currentCost += currentIncrement;
    }

    return currentCost;
};