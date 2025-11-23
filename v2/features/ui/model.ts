/**
 * Type d'onglet mobile disponible.
 * 
 * - `REACTOR` : Vue du core et des statistiques
 * - `FORGE` : Vue des upgrades et achats
 */
export type MobileTab = 'REACTOR' | 'FORGE';

/**
 * Catégorie d'upgrade pour le filtrage dans l'UI.
 * 
 * - `ALL` : Affiche tous les upgrades
 * - `PRODUCTION` : Générateurs passifs
 * - `CLICK` : Améliorations de clic
 * - `BOOSTER` : Multiplicateurs de production
 */
export type UpgradeCategory = 'ALL' | 'PRODUCTION' | 'CLICK' | 'BOOSTER';

/**
 * Données d'un texte flottant animé (feedback visuel).
 * 
 * Utilisé pour afficher les gains d'énergie au-dessus du core.
 */
export interface FloatingTextData {
    /** Identifiant unique (UUID) */
    id: string;
    /** Position X en pixels */
    x: number;
    /** Position Y en pixels */
    y: number;
    /** Texte à afficher (ex: '+150') */
    text: string;
    /** Couleur hexadécimale (ex: '#00ff00') */
    color: string;
}

/**
 * État global de la feature UI.
 * 
 * Gère l'état de l'interface utilisateur, les animations et le responsive.
 */
export interface UIState {
    /** Liste des textes flottants actuellement affichés */
    floatingTexts: FloatingTextData[];

    /** Indique si l'interface est en mode mobile */
    isMobile: boolean;

    /** Onglet actif en mode mobile */
    activeMobileTab: MobileTab;

    /** Catégorie d'upgrade active pour le filtrage */
    activeCategory: UpgradeCategory;

    /** Timestamp du dernier flash plasma (pour throttling) */
    lastPlasmaFlash: number;
}

/**
 * État initial de la feature UI.
 * 
 * Par défaut en mode desktop, onglet REACTOR, catégorie ALL.
 */
export const initialUIState: UIState = {
    floatingTexts: [],
    isMobile: false, // Sera mis à jour au mount via useDeviceLayout
    activeMobileTab: 'REACTOR',
    activeCategory: 'ALL',
    lastPlasmaFlash: 0,
};
