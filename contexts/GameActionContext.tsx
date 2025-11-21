
import React, { createContext, useContext } from 'react';
import { Notification, Achievement, Settings, QuantumPathType, GameState, SaveSlotMetadata } from '../types';
import { useDevTools } from '../hooks/useDevTools';

// Nous définissons ici la forme des actions (fonctions stables)
export interface GameActionValues {
    handlers: {
        handleContinue: () => void;
        handleNewGameClick: () => void;
        handleConfirmNewGame: () => void;
        handleCreditsClick: () => void;
        handleStartGameAfterCinematic: () => void;
        onConfirmHardReset: () => void;
        onBuyUpgrade: (index: number, amount: number | 'MAX') => void;
        onBuyTierUpgrade: (index: number) => void;
        markCategoryAsViewed: (category: string) => void;
        onAscend: () => void;
        onConfirmAscension: () => void;
        onDischargeCore: (e: React.PointerEvent) => void;
        onBuyAscensionUpgrade: (id: string) => void;
        onBuildBank: () => void;
        onDepositSavings: (amount: number) => void;
        onWithdrawSavings: (amount: number) => void;
        onTakeOutLoan: (amount: number) => void;
        onUpgradeBank: () => void;
        onRepayLoan: (amount: number) => void;
        onBuyShopUpgrade: (id: string) => void;
        onBuyQuantumShard: () => void;
        onShopCinematicComplete: () => void;
        enterQuantumInterface: (e: React.PointerEvent) => void;
        exitQuantumInterface: () => void;
        enterShopInterface: () => void;
        exitShopInterface: () => void;
        onChooseQuantumPath: (path: QuantumPathType) => void;
        onConfirmQuantumPath: () => void;
        onPurchasePathUpgrade: () => void;
        onBuyCoreUpgrade: (id: string) => void;
        onResetQuantumPath: () => void;
        onConfirmResetQuantumPath: () => void;
        onCollect: (e: React.PointerEvent<HTMLButtonElement>) => void;
        onSettingsChange: (newSettings: Partial<Settings>) => void;
        markShopItemsAsSeen: () => void;
        addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
        markAllMessagesAsRead: () => void;
        onClaimGift: () => void;
        onExportSave: (gameState: GameState, settings: Settings) => void;
        onImportSave: () => void;
        onCloudSave: (gameState: GameState, settings: Settings) => Promise<boolean>;
        onCloudLoad: (settings: Settings) => Promise<boolean>;
        registerCloudAccount: (userId: string, pass: string, apiUrl: string) => Promise<boolean>;
        loginCloudAccount: (userId: string, pass: string, apiUrl: string) => Promise<boolean>;
        checkCloudSlots: (userId: string, password: string, apiUrl: string) => Promise<SaveSlotMetadata[]>;
        loadCloudSlot: (userId: string, password: string, slotId: number, apiUrl: string) => Promise<void>;
        saveNewGameToSlot: (userId: string, password: string, slotId: number, apiUrl: string) => Promise<boolean>;
        dev: ReturnType<typeof useDevTools>;
    };
    playSfx: (sound: 'click' | 'buy' | 'ui_hover' | 'typing') => void;
    removeParticle: (id: number) => void;
    removeFloatingText: (id: number) => void;
    memoizedFormatNumber: (num: number) => string;
    addMessage: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    markAllMessagesAsRead: () => void;
    dev: ReturnType<typeof useDevTools>;
}

export const GameActionContext = createContext<GameActionValues | null>(null);

export const useGameActions = () => {
    const context = useContext(GameActionContext);
    if (!context) {
        throw new Error('useGameActions must be used within a GameActionProvider');
    }
    return context;
};
