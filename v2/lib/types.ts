import { ResourceAction } from '../features/resources/actions';
import { UpgradeAction } from '../features/upgrades/actions';
import { ClickerAction } from '../features/clicker/actions';
import { UIAction } from '../features/ui/actions';
import { CoreAction } from '../features/core/actions';

/**
 * Type générique pour une Action Redux.
 * 
 * @template T - Type de l'action (string)
 * @template P - Type du payload (any par défaut)
 */
export interface Action<T = string, P = any> {
    /** Type de l'action (ex: 'UPGRADE_BUY') */
    type: T;
    /** Données associées à l'action (optionnel) */
    payload?: P;
}

/**
 * Type générique pour un Reducer.
 * 
 * @template S - Type de l'état géré par le reducer
 * @template A - Type des actions acceptées (doit étendre Action)
 */
export type Reducer<S, A extends Action> = (state: S, action: A) => S;

/**
 * Action globale de tick (boucle de jeu).
 * 
 * Dispatchée à intervalles réguliers (100ms) pour :
 * - Ajouter l'énergie produite passivement
 * - Charger le core quantique
 * - Mettre à jour les timers
 */
export type TickAction = {
    type: 'TICK';
    payload: {
        /** Temps écoulé depuis le dernier tick en millisecondes */
        delta: number;
        /** Énergie produite durant ce tick (production * delta) */
        productionGenerated: number;
    }
};

/**
 * Union discriminée de TOUTES les actions du jeu.
 * 
 * Cette union est utilisée par le `rootReducer` pour garantir
 * l'exhaustivité du typage. Chaque reducer peut filtrer les actions
 * qui le concernent via le `switch (action.type)`.
 * 
 * @remarks
 * **IMPORTANT** : Lors de l'ajout d'une nouvelle feature, vous DEVEZ :
 * 1. Créer le type `[Feature]Action` dans la feature
 * 2. L'ajouter à cette union
 * 
 * Sinon, TypeScript ne détectera pas les erreurs de typage.
 */
export type GameAction =
    | TickAction
    | ResourceAction
    | UpgradeAction
    | ClickerAction
    | UIAction
    | CoreAction;
