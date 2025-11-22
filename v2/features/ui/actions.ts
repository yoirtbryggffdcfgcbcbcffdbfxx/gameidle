
import { Action } from '../../lib/types';
import { FloatingTextData, MobileTab, UpgradeCategory } from './model';

export type UIAction = 
    | { type: 'UI_ADD_FLOATING_TEXT'; payload: FloatingTextData }
    | { type: 'UI_REMOVE_FLOATING_TEXT'; payload: { id: string } }
    | { type: 'UI_SET_IS_MOBILE'; payload: { isMobile: boolean } }
    | { type: 'UI_SET_MOBILE_TAB'; payload: { tab: MobileTab } }
    | { type: 'UI_SET_CATEGORY'; payload: { category: UpgradeCategory } };

export const spawnFloatingText = (x: number, y: number, text: string, color: string = '#fff'): UIAction => ({
    type: 'UI_ADD_FLOATING_TEXT',
    payload: {
        id: crypto.randomUUID(),
        x,
        y,
        text,
        color
    }
});

export const removeFloatingText = (id: string): UIAction => ({
    type: 'UI_REMOVE_FLOATING_TEXT',
    payload: { id }
});

export const setIsMobile = (isMobile: boolean): UIAction => ({
    type: 'UI_SET_IS_MOBILE',
    payload: { isMobile }
});

export const setMobileTab = (tab: MobileTab): UIAction => ({
    type: 'UI_SET_MOBILE_TAB',
    payload: { tab }
});

export const setCategory = (category: UpgradeCategory): UIAction => ({
    type: 'UI_SET_CATEGORY',
    payload: { category }
});
