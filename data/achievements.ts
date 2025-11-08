import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Clic & Achat
  { name: "Étincelle Initiale", unlocked: false, description: "Collecter votre première unité d'énergie.", hidden: false, bonus: 1 },
  { name: "Premier Investissement", unlocked: false, description: "Acheter votre première amélioration.", hidden: false, bonus: 1 },
  { name: "Frénésie du Clic", unlocked: false, description: "Cliquer 1,000 fois sur le bouton d'énergie.", hidden: true, bonus: 1 },

  // Nombre total d'améliorations
  { name: "Amorce d'Empire", unlocked: false, description: "Posséder un total de 25 améliorations.", hidden: false, bonus: 1 },
  { name: "Architecte Industriel", unlocked: false, description: "Posséder un total de 150 améliorations.", hidden: false, bonus: 1 },
  { name: "Souverain Galactique", unlocked: false, description: "Posséder un total de 500 améliorations.", hidden: false, bonus: 1 },
  { name: "Collectionneur Cosmique", unlocked: false, description: "Posséder 100 Collecteurs Galactiques.", hidden: true, bonus: 1 },
  
  // Niveaux d'énergie
  { name: "Seuil de Puissance", unlocked: false, description: "Atteindre 100 unités d'énergie.", hidden: false, bonus: 1 },
  { name: "Maîtrise Énergétique", unlocked: false, description: "Atteindre 5,000 unités d'énergie.", hidden: false, bonus: 1 },
  { name: "Conscience Cosmique", unlocked: false, description: "Atteindre 100,000 unités d'énergie.", hidden: false, bonus: 1 },
  { name: "Divinité Énergétique", unlocked: false, description: "Remplir complètement votre barre d'énergie.", hidden: false, bonus: 1 },
  
  // Production par seconde
  { name: "Flux Constant", unlocked: false, description: "Atteindre une production de 10/sec.", hidden: false, bonus: 1 },
  { name: "Automatisation Complète", unlocked: false, description: "Atteindre une production de 100/sec.", hidden: false, bonus: 1 },
  { name: "Moteur de l'Infini", unlocked: false, description: "Atteindre une production de 1,000/sec.", hidden: false, bonus: 1 },
  { name: "Singularité Déchaînée", unlocked: false, description: "Atteindre une production de 100,000/sec.", hidden: false, bonus: 1 },
  
  // Ascension
  { name: "Au-delà du Voile", unlocked: false, description: "Effectuer votre première ascension.", hidden: false, bonus: 1 },
  { name: "Transcendance", unlocked: false, description: "Atteindre le niveau d'ascension 5.", hidden: false, bonus: 1 },
  { name: "Maître du Multivers", unlocked: false, description: "Atteindre le niveau d'ascension 10.", hidden: false, bonus: 1 },
  { name: "Légende Éternelle", unlocked: false, description: "Atteindre le niveau d'ascension 25.", hidden: false, bonus: 1 },

  // Cachés
  { name: "Curieux", unlocked: false, description: "Consulter les crédits du jeu.", hidden: true, bonus: 1 },
  { name: "Développeur Honoraire", unlocked: false, description: "Ouvrir le panneau de développeur.", hidden: true, bonus: 1 },
  { name: "Surcharge Quantique", unlocked: false, description: "Activer le Cœur Quantique pour la première fois.", hidden: true, bonus: 1 },
];