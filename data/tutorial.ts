
import { INITIAL_UPGRADES } from './upgrades';

const firstUpgradeCost = INITIAL_UPGRADES.find(u => u.id === 'gen_1')?.baseCost || 15;

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
        text: "Initialisation... Connexion établie. L'explosion a dispersé la matière. Architecte, nous devons stabiliser le champ local manuellement. Activez l'Injecteur.",
        sectionId: 'core',
    },
    2: {
        elementIds: ['energy-bar-container', 'collect-button'],
        text: `Résonance confirmée. Le système absorbe l'énergie brute. Continuez l'injection jusqu'à atteindre ${firstUpgradeCost} unités pour réactiver les sous-systèmes.`, 
        hideNextButton: true,
        dialogPosition: 'top',
        sectionId: 'core',
    },
    3: { 
        elementIds: ['nav-forge'], 
        text: "Capacité atteinte. Les protocoles de construction sont en ligne. Accédez à la Forge pour matérialiser nos premières structures.",
    },
    4: {
        elementIds: ['upgrade-gen_1'],
        text: "La Forge est active. Construisez ce Générateur. Il assurera une production d'énergie autonome pendant que vous supervisez l'expansion de l'univers.",
        sectionId: 'forge',
    },
    5: {
        elementIds: ['nav-core'],
        text: "Construction validée. Le flux d'énergie se stabilise. Retournons au Cœur pour calibrer la réaction en chaîne."
    },
    6: {
        elementIds: ['stat-prod'],
        text: "Analyse des flux : Voici votre 'Output'. C'est le pouls de votre système. L'énergie s'accumule désormais automatiquement à chaque cycle.",
        sectionId: 'core',
    },
    7: {
        elementIds: ['stat-click'],
        text: "Ici s'affiche votre puissance 'Manuelle'. Votre interaction directe avec le Cœur crée toujours des ondes gravitationnelles significatives.",
        sectionId: 'core',
    },
    8: {
        elementIds: ['nav-command-center'],
        text: "Nous devons cataloguer nos progrès pour optimiser le rendement. Ouvrez le Centre de Commandement.",
    },
    9: {
        // Target BOTH potential locations. useElementBounds will pick the visible one.
        elementIds: ['achievements-desktop', 'achievements-mobile'],
        text: "Voici les protocoles de 'Succès'. Chaque étape franchie dans la reconstruction de la réalité octroie des bonus permanents aux systèmes.",
        sectionId: 'command-center',
        dialogPosition: 'top',
    },
    10: { 
        isGlobal: true, 
        text: "Systèmes nominaux. Architecte, cet univers est une page blanche. Générez, optimisez, et visez l'Ascension pour transcender cette réalité. Je reste en veille.",
    },
};
