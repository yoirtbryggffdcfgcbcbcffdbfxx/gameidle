
export type MobileTab = 'REACTOR' | 'FORGE';
export type UpgradeCategory = 'ALL' | 'PRODUCTION' | 'CLICK' | 'BOOSTER';

export interface FloatingTextData {
    id: string;
    x: number;
    y: number;
    text: string;
    color: string;
}

export interface UIState {
    floatingTexts: FloatingTextData[];
    isMobile: boolean;
    activeMobileTab: MobileTab;
    activeCategory: UpgradeCategory;
}

export const initialUIState: UIState = {
    floatingTexts: [],
    isMobile: false, // Par défaut desktop, sera mis à jour au mount
    activeMobileTab: 'REACTOR',
    activeCategory: 'ALL',
};
