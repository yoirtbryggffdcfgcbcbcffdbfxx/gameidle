
import { UIState } from './model';
import { GameAction } from '../../lib/types';

export const uiReducer = (state: UIState, action: GameAction): UIState => {
    switch (action.type) {
        case 'UI_ADD_FLOATING_TEXT':
            const currentTexts = state.floatingTexts.length > 20 
                ? state.floatingTexts.slice(1) 
                : state.floatingTexts;
                
            return {
                ...state,
                floatingTexts: [...currentTexts, action.payload]
            };

        case 'UI_REMOVE_FLOATING_TEXT':
            return {
                ...state,
                floatingTexts: state.floatingTexts.filter(t => t.id !== action.payload.id)
            };

        case 'UI_SET_IS_MOBILE':
            return {
                ...state,
                isMobile: action.payload.isMobile
            };

        case 'UI_SET_MOBILE_TAB':
            return {
                ...state,
                activeMobileTab: action.payload.tab
            };

        case 'UI_SET_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload.category
            };

        default:
            return state;
    }
};
