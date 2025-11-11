
export interface TutorialStep {
    elementIds?: string[];
    text: string;
    isGlobal?: boolean;
    hideNextButton?: boolean;
    dialogPosition?: 'top' | 'bottom';
    sectionId?: string;
}

export const tutorialSteps: { [key: number]: TutorialStep } = {
    1: { 
        elementIds: ['collect-button'], 
        text: "Bienvenue, Capitaine. Je suis votre IA de bord. Commençons par générer de l'énergie. Cliquez sur ce bouton.",
        sectionId: 'core',
    },
    2: {
        elementIds: ['energy-bar-container', 'collect-button'],
        text: "Excellent. L'énergie que vous collectez remplit cette barre. Continuez jusqu'à 15 unités pour notre premier achat.", 
        hideNextButton: true,
        dialogPosition: 'top',
        sectionId: 'core',
    },
    3: { 
        elementIds: ['nav-forge'], 
        text: "Parfait. Maintenant, utilisez la navigation pour vous rendre à la Forge et dépenser cette énergie.",
    },
    4: {
        elementIds: ['upgrade-gen_1'],
        text: "Voici les générateurs. Achetez celui-ci pour lancer notre production d'énergie passive. Il travaillera pour nous.",
        sectionId: 'forge',
    },
    5: {
        elementIds: ['nav-core'],
        text: "Générateur activé ! Retournons au Cœur pour voir ses effets."
    },
    6: {
        elementIds: ['stat-prod'],
        text: "Regardez ! Votre 'Prod/sec' a augmenté. Vous gagnez maintenant de l'énergie automatiquement.",
        sectionId: 'core',
    },
    7: {
        elementIds: ['stat-click'],
        text: "Et ceci est votre puissance de 'Clic', l'énergie que vous gagnez à chaque clic manuel. Vous pourrez aussi l'améliorer.",
        sectionId: 'core',
    },
    8: {
        elementIds: ['nav-command-center'],
        text: "Bien. Allons au Centre de Commandement pour suivre nos progrès.",
    },
    9: {
        elementIds: ['achievements-panel'],
        text: "Ici, vous pouvez voir les Succès. En débloquer vous donne des bonus permanents. C'est un objectif clé.",
        sectionId: 'command-center',
        dialogPosition: 'top',
    },
    10: { 
        isGlobal: true, 
        text: "Vous maîtrisez les bases. Votre mission : générer, améliorer, et atteindre l'Ascension. Je serai en veille si nécessaire. Bonne chance.",
    },
};