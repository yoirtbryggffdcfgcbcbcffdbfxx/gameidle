
import { ResourceState, initialResourceState } from '../features/resources/model';
import { resourceReducer } from '../features/resources/reducer';
import { UpgradesState, initialUpgradesState } from '../features/upgrades/model';
import { upgradesReducer } from '../features/upgrades/reducer';
import { UIState, initialUIState } from '../features/ui/model';
import { uiReducer } from '../features/ui/reducer';
import { CoreState, initialCoreState } from '../features/core/model';
import { coreReducer } from '../features/core/reducer';
import { GameAction } from './types';

// 1. Structure de l'État Global
export interface RootState {
    resources: ResourceState;
    upgrades: UpgradesState;
    ui: UIState;
    core: CoreState;
}

// 2. État Initial Global
export const initialRootState: RootState = {
    resources: initialResourceState,
    upgrades: initialUpgradesState,
    ui: initialUIState,
    core: initialCoreState,
};

// 3. Le Root Reducer avec Typage Strict
export const rootReducer = (state: RootState, action: GameAction): RootState => {
    return {
        resources: resourceReducer(state.resources, action),
        upgrades: upgradesReducer(state.upgrades, action),
        ui: uiReducer(state.ui, action),
        core: coreReducer(state.core, action),
    };
};
