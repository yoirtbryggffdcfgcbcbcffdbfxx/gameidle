import { z } from 'zod';

/**
 * Schéma Zod pour le type d'upgrade.
 * 
 * Valide que le type est l'une des 3 valeurs autorisées.
 */
export const UpgradeTypeSchema = z.enum(['PRODUCTION', 'CLICK', 'BOOSTER']);

/**
 * Schéma Zod pour un Upgrade.
 * 
 * Valide la structure complète d'un upgrade avec toutes les contraintes métier :
 * - Les coûts et productions doivent être positifs
 * - Les compteurs (owned, tier) doivent être >= 0
 * - Les couleurs doivent être au format hexadécimal
 * - Les IDs ne doivent pas être vides
 */
export const UpgradeSchema = z.object({
    /** Identifiant unique (non vide) */
    id: z.string().min(1, 'ID ne peut pas être vide'),

    /** Nom affiché (non vide) */
    name: z.string().min(1, 'Name ne peut pas être vide'),

    /** Description (peut être vide) */
    description: z.string(),

    /** Coût de base (doit être positif) */
    baseCost: z.number().positive('baseCost doit être > 0'),

    /** Production de base (doit être >= 0) */
    baseProduction: z.number().nonnegative('baseProduction doit être >= 0'),

    /** Nombre possédé (doit être >= 0) */
    owned: z.number().int().nonnegative('owned doit être >= 0'),

    /** Niveau de tier (doit être >= 0) */
    tier: z.number().int().nonnegative('tier doit être >= 0'),

    /** Couleur hexadécimale (format #RRGGBB ou #RGB) */
    color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'color doit être au format hexadécimal'),

    /** Type d'upgrade */
    type: UpgradeTypeSchema,

    /** Coût d'unlock (doit être >= 0) */
    unlockCost: z.number().nonnegative('unlockCost doit être >= 0'),

    /** ID de l'upgrade parent requis (optionnel) */
    requiredUpgradeId: z.string().optional(),

    /** Niveau d'ascension requis (doit être >= 0) */
    requiredAscension: z.number().int().nonnegative('requiredAscension doit être >= 0'),

    /** Coût personnalisé après tier (optionnel, doit être positif si défini) */
    nextLevelCostOverride: z.number().positive().optional(),
});

/**
 * Type TypeScript inféré depuis le schéma Zod.
 * 
 * Garantit la cohérence entre le schéma de validation et le type TypeScript.
 */
export type UpgradeFromSchema = z.infer<typeof UpgradeSchema>;

/**
 * Schéma pour un tableau d'upgrades.
 * 
 * Valide que c'est un tableau non vide d'upgrades valides.
 */
export const UpgradesArraySchema = z.array(UpgradeSchema).min(1, 'Il doit y avoir au moins 1 upgrade');

/**
 * Schéma pour le statut du core.
 */
export const CoreStatusSchema = z.enum(['CHARGING', 'READY', 'ACTIVE']);

/**
 * Schéma pour l'onglet mobile.
 */
export const MobileTabSchema = z.enum(['REACTOR', 'FORGE']);

/**
 * Schéma pour la catégorie d'upgrade.
 */
export const UpgradeCategorySchema = z.enum(['ALL', 'PRODUCTION', 'CLICK', 'BOOSTER']);
