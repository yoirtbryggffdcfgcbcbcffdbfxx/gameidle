
import { UPGRADES_DATA } from './data';

export type UpgradeType = 'PRODUCTION' | 'CLICK' | 'BOOSTER';

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    baseProduction: number; // Pour Click: par clic, Pour Prod: par sec, Pour Booster: %
    owned: number;
    tier: number; // Niveau d'évolution (ex: tous les 10, 25, 100)
    color: string;
    type: UpgradeType;
    
    // Logique de progression (Unlock System)
    unlockCost: number; // Énergie totale requise pour voir l'item
    requiredUpgradeId?: string; // Parent requis (ex: Gen 2 requiert Gen 1)
    requiredAscension: number; // Niveau d'ascension requis
}

export interface UpgradesState {
    available: Upgrade[];
}

export const initialUpgradesState: UpgradesState = {
    available: UPGRADES_DATA
};
