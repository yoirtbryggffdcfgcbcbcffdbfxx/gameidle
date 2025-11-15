import { ShopUpgrade } from '../types';

export const SHOP_UNLOCK_TOTAL_ENERGY = 10000;

export const SHOP_UPGRADES: ShopUpgrade[] = [
    {
        id: 'buy_multiplier_10',
        name: "Achat en Gros x10",
        description: "Débloque le multiplicateur d'achat x10 dans la Forge pour acheter des niveaux plus rapidement.",
        cost: 1000,
        currency: 'energy',
        icon: 'buy_10',
    },
    {
        id: 'efficiency_percentage',
        name: "Analyseur v1 : Pourcentages",
        description: "Affiche le pourcentage d'efficacité relative sur chaque amélioration de production, vous aidant à comparer leur rentabilité.",
        cost: 10000,
        currency: 'energy',
        icon: 'percent',
    },
    {
        id: 'eps_meter',
        name: "Compteur de Prod. Moyenne",
        description: "Ajoute un indicateur dans la section Cœur qui affiche votre production moyenne par seconde sur les 10 dernières secondes.",
        cost: 20000,
        currency: 'energy',
        icon: 'trending_up',
    },
    {
        id: 'efficiency_highlight',
        name: "Analyseur v2 : Surlignage",
        description: "Surligne en permanence l'amélioration de production la plus rentable, vous guidant vers l'investissement optimal.",
        cost: 50000,
        currency: 'energy',
        icon: 'highlight',
    },
    {
        id: 'buy_multiplier_max',
        name: "Achat en Gros xMAX",
        description: "Débloque le multiplicateur d'achat xMAX dans la Forge pour acheter tous les niveaux possibles d'un coup.",
        cost: 75000,
        currency: 'energy',
        icon: 'max',
    },
    {
        id: 'buy_multiplier_100',
        name: "Achat en Gros x100",
        description: "Débloque le multiplicateur d'achat x100 dans la Forge, pour les vrais magnats de l'énergie.",
        cost: 100000,
        currency: 'energy',
        icon: 'buy_100',
    },
];