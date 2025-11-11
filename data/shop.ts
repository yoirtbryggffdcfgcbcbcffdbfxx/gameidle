import { ShopUpgrade } from '../types';

export const SHOP_UPGRADES: ShopUpgrade[] = [
    {
        id: 'efficiency_percentage',
        name: "Analyseur v1 : Pourcentages",
        description: "Affiche le pourcentage d'efficacité relative sur chaque amélioration de production, vous aidant à comparer leur rentabilité.",
        cost: 15000,
        currency: 'energy',
        icon: '📊',
    },
    {
        id: 'eps_meter',
        name: "Compteur de Prod. Moyenne",
        description: "Ajoute un indicateur dans la section Cœur qui affiche votre production moyenne par seconde sur les 10 dernières secondes.",
        cost: 20000,
        currency: 'energy',
        icon: '📈',
    },
    {
        id: 'efficiency_highlight',
        name: "Analyseur v2 : Surlignage",
        description: "Surligne en permanence l'amélioration de production la plus rentable, vous guidant vers l'investissement optimal.",
        cost: 50000,
        currency: 'energy',
        icon: '💡',
    },
];