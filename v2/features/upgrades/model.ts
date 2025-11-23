import { UPGRADES_DATA } from './data';

/**
 * Type d'amélioration disponible dans le jeu.
 * 
 * - `PRODUCTION` : Génère de l'énergie passivement (par seconde)
 * - `CLICK` : Augmente l'énergie gagnée par clic manuel
 * - `BOOSTER` : Multiplie la production globale (pourcentage)
 */
export type UpgradeType = 'PRODUCTION' | 'CLICK' | 'BOOSTER';

/**
 * Représente une amélioration achetable dans le jeu.
 * 
 * Les upgrades suivent un système de progression avec :
 * - Coût exponentiel basé sur le nombre possédé
 * - Système de tiers avec paliers (10, 25, 100) offrant des réductions
 * - Système d'unlock basé sur l'énergie totale et les dépendances
 */
export interface Upgrade {
    /** Identifiant unique de l'upgrade (ex: 'gen1', 'click2') */
    id: string;

    /** Nom affiché dans l'interface (ex: 'Générateur Quantique') */
    name: string;

    /** Description courte de l'upgrade */
    description: string;

    /** 
     * Coût de base pour le premier achat.
     * Le coût réel est calculé avec scaling exponentiel : `baseCost * (1.15 ^ owned)`
     */
    baseCost: number;

    /** 
     * Production de base par unité possédée.
     * - Pour PRODUCTION : énergie/seconde
     * - Pour CLICK : énergie par clic
     * - Pour BOOSTER : pourcentage de boost (ex: 10 = +10%)
     */
    baseProduction: number;

    /** Nombre d'unités possédées par le joueur */
    owned: number;

    /** 
     * Niveau de tier actuel (paliers : 10, 25, 100).
     * Atteindre un tier déclenche un discount sur les achats suivants.
     */
    tier: number;

    /** Couleur hexadécimale pour l'affichage (ex: '#3b82f6') */
    color: string;

    /** Type d'upgrade déterminant son comportement */
    type: UpgradeType;

    // ─────────────────────────────────────────────────────────
    // Logique de progression (Unlock System)
    // ─────────────────────────────────────────────────────────

    /** 
     * Énergie totale cumulée requise pour débloquer cet upgrade.
     * L'upgrade reste invisible tant que le joueur n'a pas généré ce montant.
     */
    unlockCost: number;

    /** 
     * ID de l'upgrade parent requis (optionnel).
     * Si défini, le joueur doit posséder au moins 1 unité du parent pour débloquer.
     * Exemple : 'gen2' requiert 'gen1'
     */
    requiredUpgradeId?: string;

    /** 
     * Niveau d'ascension minimum requis pour débloquer.
     * 0 = disponible dès le début
     */
    requiredAscension: number;

    // ─────────────────────────────────────────────────────────
    // Système de Tiers (Discount après achat de tier)
    // ─────────────────────────────────────────────────────────

    /** 
     * Coût personnalisé après atteinte d'un tier (optionnel).
     * Si undefined, utilise la formule standard `baseCost * scaling`.
     * Permet d'appliquer des réductions après paliers (10, 25, 100).
     */
    nextLevelCostOverride?: number;
}

/**
 * État global de la feature Upgrades.
 * 
 * Contient la liste de toutes les améliorations disponibles dans le jeu,
 * qu'elles soient débloquées ou non.
 */
export interface UpgradesState {
    /** Liste complète des upgrades du jeu */
    available: Upgrade[];
}

/**
 * État initial de la feature Upgrades.
 * 
 * Charge les données depuis `data.ts` avec tous les upgrades configurés.
 */
export const initialUpgradesState: UpgradesState = {
    available: UPGRADES_DATA
};
