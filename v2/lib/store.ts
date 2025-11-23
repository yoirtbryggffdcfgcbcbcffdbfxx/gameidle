import { ResourceState, initialResourceState } from '../features/resources/model';
import { resourceReducer } from '../features/resources/reducer';
import { UpgradesState, initialUpgradesState } from '../features/upgrades/model';
import { upgradesReducer } from '../features/upgrades/reducer';
import { UIState, initialUIState } from '../features/ui/model';
import { uiReducer } from '../features/ui/reducer';
import { CoreState, initialCoreState } from '../features/core/model';
import { coreReducer } from '../features/core/reducer';
import { GameAction } from './types';

/**
 * Structure de l'état global de l'application.
 * 
 * Chaque clé correspond à une feature isolée.
 * Les features ne peuvent pas accéder directement à l'état d'une autre feature.
 */
export interface RootState {
    /** État de la feature Resources (énergie) */
    resources: ResourceState;

    /** État de la feature Upgrades (améliorations) */
    upgrades: UpgradesState;

    /** État de la feature UI (interface, animations) */
    ui: UIState;

    /** État de la feature Core (core quantique) */
    core: CoreState;
}

/**
 * État initial global de l'application.
 * 
 * Combine les états initiaux de toutes les features.
 */
export const initialRootState: RootState = {
    resources: initialResourceState,
    upgrades: initialUpgradesState,
    ui: initialUIState,
    core: initialCoreState,
};

/**
 * Root Reducer avec typage strict.
 * 
 * Combine tous les reducers de features en un seul reducer global.
 * Chaque action est dispatchée à TOUS les reducers, qui filtrent
 * les actions qui les concernent.
 * 
 * @param state - État global actuel
 * @param action - Action dispatchée (typée avec GameAction)
 * @returns Nouvel état global après application de l'action
 * 
 * @remarks
 * **Pattern utilisé** : Composition de reducers (similaire à Redux `combineReducers`).
 * Chaque reducer est responsable de sa propre slice de l'état.
 * 
 * **Ajout d'une nouvelle feature** :
 * 1. Importer le state, initialState et reducer de la feature
 * 2. Ajouter la clé dans `RootState`
 * 3. Ajouter la clé dans `initialRootState`
 * 4. Ajouter l'appel au reducer dans le return
 */
export const rootReducer = (state: RootState, action: GameAction): RootState => {
    return {
        resources: resourceReducer(state.resources, action),
        upgrades: upgradesReducer(state.upgrades, action),
        ui: uiReducer(state.ui, action),
        core: coreReducer(state.core, action),
    };
};
