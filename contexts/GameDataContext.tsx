
import React, { createContext, useContext } from 'react';
import { GameState, Settings, QuantumPathType, Particle, FloatingText, Notification } from '../types';
import { usePopupManager } from '../hooks/usePopupManager';

// Définition des types de bonus pour éviter 'any'
interface AscensionBonuses {
    productionMultiplier: number;
    clickMultiplier: number;
    costReduction: number;
    startingEnergy: number;
}

interface AchievementBonuses {
    production: number;
    click: number;
    coreCharge: number;
    costReduction: number;
}

interface CoreBonuses {
    chargeRate: number;
    multiplier: number;
    duration: number;
}

interface BankBonuses {
    savingsInterest: number;
    loanInterest: number;
}

interface VisibleUpgrade {
    upgradeData: any; // On garde any ici pour l'instant car Upgrade dépend de player.ts qui est complexe à importer circulairement, ou on utilise GameState['upgrades'][0]
    originalIndex: number;
}

// Nous définissons ici la forme des données réactives
export interface GameDataValues {
    appState: 'loading' | 'menu' | 'game' | 'cinematic';
    hasSaveData: boolean;
    gameState: GameState;
    computedState: {
        ascensionBonuses: AscensionBonuses;
        achievementBonuses: AchievementBonuses;
        coreBonuses: CoreBonuses;
        bankBonuses: BankBonuses;
        costMultiplier: number;
        productionTotal: number;
        netProduction: number;
        clickPower: number;
        maxEnergy: number;
        energyCap: number;
        canAscend: boolean;
        ascensionGain: number;
        visibleUpgrades: VisibleUpgrade[];
        unlockedUpgradesAtMaxLevelCount: number;
        unlockedUpgradesForCurrentAscensionCount: number;
        newlyVisibleUpgradeIds: string[];
        newlyVisibleUpgradeTypes: Set<string>;
        timeToFullSeconds: number;
        displayMaxEnergy: number;
        unreadMessageCount: number;
        avgProductionLast10s: number;
    };
    uiState: {
        settings: Settings;
        activeView: string;
        pathChoiceToConfirm: QuantumPathType | null;
        particles: Particle[];
        floatingTexts: FloatingText[];
        // Propriétés du PopupManager injectées ici
        activePopup: string | null;
        tutorialStep: number;
        showHardResetConfirm: boolean;
        showNewGameConfirm: boolean;
        showAscensionConfirm: boolean;
        showAscensionTutorial: boolean;
        showBankInfoPopup: boolean;
        showCoreTutorial: boolean;
        showBankTutorial: boolean;
        showShopTutorial: boolean;
        showDevPanel: boolean;
        showQuantumPathConfirm: boolean;
        showQuantumPathResetConfirm: boolean;
        activeMobilePopup: 'achievements' | 'shop' | 'settings' | null;
        isMessageCenterOpen: boolean;
        isDevModeActive: boolean;
        forceShowCursor: boolean;
        showGiftPopup: boolean;
        // Autres propriétés UI
        notifications: Notification[];
    };
    popups: ReturnType<typeof usePopupManager>;
}

export const GameDataContext = createContext<GameDataValues | null>(null);

export const useGameData = () => {
    const context = useContext(GameDataContext);
    if (!context) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }
    return context;
};
