import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Clic & Achat
  { name: "Étincelle Initiale", unlocked: false, description: "Collecter votre première unité d'énergie.", hidden: false, bonus: { type: 'CLICK', value: 5 } },
  { name: "Premier Investissement", unlocked: false, description: "Acheter votre première amélioration.", hidden: false, bonus: { type: 'COST_REDUCTION', value: 1 } },
  { name: "Frénésie du Clic", unlocked: false, description: "Cliquer 1,000 fois sur le bouton d'énergie.", hidden: true, bonus: { type: 'CLICK', value: 10 } },

  // Nombre total d'améliorations
  { name: "Amorce d'Empire", unlocked: false, description: "Posséder un total de 25 améliorations.", hidden: false, bonus: { type: 'COST_REDUCTION', value: 1 } },
  { name: "Architecte Industriel", unlocked: false, description: "Posséder un total de 150 améliorations.", hidden: false, bonus: { type: 'COST_REDUCTION', value: 2 } },
  { name: "Souverain Galactique", unlocked: false, description: "Posséder un total de 500 améliorations.", hidden: false, bonus: { type: 'COST_REDUCTION', value: 2 } },
  { name: "Collectionneur Cosmique", unlocked: false, description: "Posséder 100 unités du Collecteur Galactique.", hidden: true, bonus: { type: 'PRODUCTION', value: 5 }, relatedUpgradeName: 'Collecteur Galactique' },
  
  // Niveaux d'énergie
  { name: "Seuil de Puissance", unlocked: false, description: "Atteindre 100 unités d'énergie.", hidden: false, bonus: { type: 'PRODUCTION', value: 1 } },
  { name: "Maîtrise Énergétique", unlocked: false, description: "Atteindre 5,000 unités d'énergie.", hidden: false, bonus: { type: 'PRODUCTION', value: 1 } },
  { name: "Conscience Cosmique", unlocked: false, description: "Atteindre 100,000 unités d'énergie.", hidden: false, bonus: { type: 'PRODUCTION', value: 1 } },
  { name: "Divinité Énergétique", unlocked: false, description: "Remplir complètement votre barre d'énergie.", hidden: false, bonus: { type: 'PRODUCTION', value: 2 } },
  
  // Production par seconde
  { name: "Flux Constant", unlocked: false, description: "Atteindre une production de 10/sec.", hidden: false, bonus: { type: 'PRODUCTION', value: 1 } },
  { name: "Automatisation Complète", unlocked: false, description: "Atteindre une production de 100/sec.", hidden: false, bonus: { type: 'PRODUCTION', value: 1 } },
  { name: "Moteur de l'Infini", unlocked: false, description: "Atteindre une production de 1,000/sec.", hidden: false, bonus: { type: 'PRODUCTION', value: 2 } },
  { name: "Singularité Déchaînée", unlocked: false, description: "Atteindre une production de 100,000/sec.", hidden: false, bonus: { type: 'PRODUCTION', value: 3 } },
  
  // Ascension
  { name: "Au-delà du Voile", unlocked: false, description: "Effectuer votre première ascension.", hidden: false, bonus: { type: 'PRODUCTION', value: 5 } },
  { name: "Transcendance", unlocked: false, description: "Atteindre le niveau d'ascension 5.", hidden: false, bonus: { type: 'PRODUCTION', value: 5 } },
  { name: "Maître du Multivers", unlocked: false, description: "Atteindre le niveau d'ascension 10.", hidden: false, bonus: { type: 'PRODUCTION', value: 5 } },
  { name: "Légende Éternelle", unlocked: false, description: "Atteindre le niveau d'ascension 25.", hidden: false, bonus: { type: 'PRODUCTION', value: 5 } },

  // Cachés
  { name: "Curieux", unlocked: false, description: "Consulter les crédits du jeu.", hidden: true, bonus: { type: 'COST_REDUCTION', value: 1 } },
  { name: "Développeur Honoraire", unlocked: false, description: "Ouvrir le panneau de développeur.", hidden: true, bonus: { type: 'PRODUCTION', value: 10 } },
  { name: "Surcharge Quantique", unlocked: false, description: "Activer le Cœur Quantique pour la première fois.", hidden: true, bonus: { type: 'CORE_CHARGE', value: 5 } },
];