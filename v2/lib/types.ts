
import { ResourceAction } from '../features/resources/actions';
import { UpgradeAction } from '../features/upgrades/actions';
import { ClickerAction } from '../features/clicker/actions';
import { UIAction } from '../features/ui/actions';
import { CoreAction } from '../features/core/actions';

// Type générique pour une Action
export interface Action<T = string, P = any> {
    type: T;
    payload?: P;
}

// Type pour un Reducer générique
export type Reducer<S, A extends Action> = (state: S, action: A) => S;

// Action de temps globale
export type TickAction = { 
    type: 'TICK'; 
    payload: { 
        delta: number; // Temps écoulé en ms (ex: 100)
        productionGenerated: number; // Énergie produite durant ce tick
    } 
};

// L'Union Sacrée : Toutes les actions possibles du jeu
export type GameAction = 
    | TickAction 
    | ResourceAction 
    | UpgradeAction 
    | ClickerAction
    | UIAction
    | CoreAction;
