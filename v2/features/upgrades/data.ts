import { Upgrade } from './model';
import { UpgradeSchema } from '../../lib/schemas';

/**
 * Données brutes des upgrades avant validation.
 * 
 * Ces données sont validées au runtime avec Zod pour garantir leur cohérence.
 */
const RAW_UPGRADES_DATA: Upgrade[] = [
    // --- PRODUCTION (GÉNÉRATEURS) ---
    {
        id: 'gen_1',
        name: 'Générateur Alpha',
        description: 'Capture les particules ambiantes pour une production stable.',
        baseCost: 15,
        baseProduction: 1,
        type: 'PRODUCTION',
        color: '#00aaff',
        owned: 0,
        tier: 0,
        unlockCost: 0,
        requiredAscension: 0
    },
    {
        id: 'gen_2',
        name: 'Faisceau Beta',
        description: 'Concentre le flux ionique pour multiplier le rendement.',
        baseCost: 100,
        baseProduction: 5,
        type: 'PRODUCTION',
        color: '#00ccff',
        owned: 0,
        tier: 0,
        unlockCost: 75,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_1'
    },
    {
        id: 'gen_3',
        name: 'Matrice Gamma',
        description: 'Structure cristalline résonante auto-alimentée.',
        baseCost: 1100,
        baseProduction: 32,
        type: 'PRODUCTION',
        color: '#00e1ff',
        owned: 0,
        tier: 0,
        unlockCost: 825,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_2'
    },
    {
        id: 'gen_4',
        name: 'Injecteur Delta',
        description: 'Injecte du plasma directement dans le cœur du réseau.',
        baseCost: 12000,
        baseProduction: 220,
        type: 'PRODUCTION',
        color: '#33ffcc',
        owned: 0,
        tier: 0,
        unlockCost: 9000,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_3'
    },
    {
        id: 'gen_5',
        name: 'Réacteur Epsilon',
        description: 'Fusion de neutrinos à froid. Hautement instable.',
        baseCost: 130000,
        baseProduction: 1100,
        type: 'PRODUCTION',
        color: '#66ff99',
        owned: 0,
        tier: 0,
        unlockCost: 97500,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_4'
    },
    {
        id: 'gen_6',
        name: 'Forge Zeta',
        description: 'Forge stellaire miniaturisée. Crée de la matière ex nihilo.',
        baseCost: 1.4e6,
        baseProduction: 6500,
        type: 'PRODUCTION',
        color: '#99ff66',
        owned: 0,
        tier: 0,
        unlockCost: 1050000,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_5'
    },
    {
        id: 'gen_7',
        name: 'Complexe Eta',
        description: 'Exploite l\'énergie sombre des dimensions parallèles.',
        baseCost: 20e6,
        baseProduction: 55000,
        type: 'PRODUCTION',
        color: '#ccff33',
        owned: 0,
        tier: 0,
        unlockCost: 15000000,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_6'
    },
    {
        id: 'gen_8',
        name: 'Collecteur Theta',
        description: 'Moissonneuse galactique de classe 4.',
        baseCost: 300e6,
        baseProduction: 450000,
        type: 'PRODUCTION',
        color: '#ffff00',
        owned: 0,
        tier: 0,
        unlockCost: 225e6,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_7'
    },
    {
        id: 'gen_9',
        name: 'Puits Iota',
        description: 'Singularité artificielle contrôlée. Production infinie.',
        baseCost: 5e9,
        baseProduction: 3500000,
        type: 'PRODUCTION',
        color: '#e6ff00',
        owned: 0,
        tier: 0,
        unlockCost: 3.75e9,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_8'
    },

    // --- CLIC (MANUEL) ---
    {
        id: 'click_1',
        name: 'Gant Tactile I',
        description: 'Optimisation haptique de base.',
        baseCost: 25,
        baseProduction: 1,
        type: 'CLICK',
        color: '#ff9900',
        owned: 0,
        tier: 0,
        unlockCost: 15,
        requiredAscension: 0
    },
    {
        id: 'click_2',
        name: 'Algorithme II',
        description: 'Prédiction de mouvement assistée par IA.',
        baseCost: 250,
        baseProduction: 5,
        type: 'CLICK',
        color: '#ff6600',
        owned: 0,
        tier: 0,
        unlockCost: 185,
        requiredAscension: 0,
        requiredUpgradeId: 'click_1'
    },
    {
        id: 'click_3',
        name: 'Prédiction III',
        description: 'Clique avant même que vous n\'y pensiez.',
        baseCost: 5000,
        baseProduction: 140,
        type: 'CLICK',
        color: '#ff3300',
        owned: 0,
        tier: 0,
        unlockCost: 3750,
        requiredAscension: 0,
        requiredUpgradeId: 'click_2'
    },
    {
        id: 'click_4',
        name: 'Doigt Divin IV',
        description: 'Manipulation directe de la trame.',
        baseCost: 150000,
        baseProduction: 4500,
        type: 'CLICK',
        color: '#ff0000',
        owned: 0,
        tier: 0,
        unlockCost: 112500,
        requiredAscension: 0,
        requiredUpgradeId: 'click_3'
    },
    {
        id: 'click_5',
        name: 'Singularité V',
        description: 'Chaque touche crée un micro big-bang.',
        baseCost: 3.5e6,
        baseProduction: 120000,
        type: 'CLICK',
        color: '#cc0000',
        owned: 0,
        tier: 0,
        unlockCost: 2625000,
        requiredAscension: 0,
        requiredUpgradeId: 'click_4'
    },
    {
        id: 'click_6',
        name: 'Résonance VI',
        description: 'Synchronisation neuronale directe.',
        baseCost: 80e6,
        baseProduction: 1800000,
        type: 'CLICK',
        color: '#990000',
        owned: 0,
        tier: 0,
        unlockCost: 60000000,
        requiredAscension: 0,
        requiredUpgradeId: 'click_5'
    },
    {
        id: 'click_7',
        name: 'Architecte VII',
        description: 'Vous êtes le code.',
        baseCost: 2.5e9,
        baseProduction: 24000000,
        type: 'CLICK',
        color: '#660000',
        owned: 0,
        tier: 0,
        unlockCost: 1.8e9,
        requiredAscension: 0,
        requiredUpgradeId: 'click_6'
    },

    // --- BOOSTERS ---
    {
        id: 'boost_1',
        name: 'Amplificateur',
        description: 'Augmente la production globale de +5%.',
        baseCost: 25000,
        baseProduction: 5,
        type: 'BOOSTER',
        color: '#a855f7',
        owned: 0,
        tier: 0,
        unlockCost: 18750,
        requiredAscension: 0
    },
    {
        id: 'boost_2',
        name: 'Optimiseur',
        description: 'Augmente la production globale de +20%.',
        baseCost: 5e6,
        baseProduction: 20,
        type: 'BOOSTER',
        color: '#d946ef',
        owned: 0,
        tier: 0,
        unlockCost: 3750000,
        requiredAscension: 0,
        requiredUpgradeId: 'boost_1'
    },
    {
        id: 'boost_3',
        name: 'Harmoniseur',
        description: 'Augmente la production globale de +50%.',
        baseCost: 1e9,
        baseProduction: 50,
        type: 'BOOSTER',
        color: '#f026ef',
        owned: 0,
        tier: 0,
        unlockCost: 750000000,
        requiredAscension: 0,
        requiredUpgradeId: 'boost_2'
    },
    {
        id: 'boost_gift_1',
        name: 'Chance Quantique',
        description: 'Permet l\'apparition d\'anomalies positives (Cadeaux).',
        baseCost: 15000,
        baseProduction: 0,
        type: 'BOOSTER',
        color: '#22d3ee',
        owned: 0,
        tier: 0,
        unlockCost: 11250,
        requiredAscension: 0
    },

    // --- ULTIMATE ---
    {
        id: 'ultimate_1',
        name: 'Le Grand Œuvre',
        description: 'Une machine capable de réécrire les constantes universelles.',
        baseCost: 1e11,
        baseProduction: 45e6,
        type: 'PRODUCTION',
        color: '#ffffff',
        owned: 0,
        tier: 0,
        unlockCost: 75e9,
        requiredAscension: 0,
        requiredUpgradeId: 'gen_9'
    },
];

/**
 * Données des upgrades validées avec Zod.
 * 
 * Si une erreur de validation est détectée, le build échouera avec un message clair.
 * Cela garantit que toutes les données sont cohérentes avant le runtime.
 * 
 * @throws {Error} Si les données ne respectent pas le schéma
 */
export const UPGRADES_DATA: Upgrade[] = RAW_UPGRADES_DATA.map((upgrade, index) => {
    const result = UpgradeSchema.safeParse(upgrade);

    if (!result.success) {
        console.error(`❌ Erreur de validation pour l'upgrade à l'index ${index} (id: ${upgrade.id}):`);
        console.error(result.error.format());
        throw new Error(`Validation échouée pour l'upgrade ${upgrade.id}`);
    }

    return result.data as Upgrade;
});
