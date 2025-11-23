/**
 * État global de la feature Resources.
 * 
 * Gère l'énergie du joueur (ressource principale du jeu) et le tracking
 * de la progression totale pour le système d'unlock.
 */
export interface ResourceState {
    /** 
     * Énergie actuelle disponible pour acheter des upgrades.
     * Peut diminuer lors d'achats.
     */
    energy: number;

    /** 
     * Énergie totale générée depuis le début de la partie.
     * Utilisé pour débloquer les upgrades (voir `unlockCost` dans upgrades).
     * Cette valeur ne diminue jamais.
     */
    totalGenerated: number;
}

/**
 * État initial de la feature Resources.
 * 
 * Le joueur commence avec 0 énergie.
 */
export const initialResourceState: ResourceState = {
    energy: 0,
    totalGenerated: 0,
};
