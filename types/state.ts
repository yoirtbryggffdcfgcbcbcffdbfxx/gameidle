
import { Upgrade, Achievement } from './player';
import { Loan } from './economy';
import { QuantumPathType } from './core';
import { Notification } from './ui';

export interface GameState {
    energy: number;
    upgrades: Upgrade[];
    ascensionLevel: number;
    ascensionPoints: number;
    achievements: Achievement[];
    purchasedAscensionUpgrades: string[];
    purchasedCoreUpgrades: string[];
    totalClicks: number;
    hasSeenAscensionTutorial: boolean;
    coreCharge: number;
    isCoreDischarging: boolean;
    coreDischargeEndTimestamp: number | null;
    quantumShards: number;
    hasSeenCoreTutorial: boolean;
    totalEnergyProduced: number;
    isBankUnlocked: boolean;
    isBankDiscovered: boolean;
    savingsBalance: number;
    currentLoan: Loan | null;
    bankLevel: number;
    hasSeenBankTutorial: boolean;
    loanTier: number;
    purchasedShopUpgrades: string[];
    productionHistory: { value: number; duration: number }[];
    seenUpgrades: string[];
    viewedCategories: string[];
    isShopUnlocked: boolean;
    isCoreUnlocked: boolean;
    hasUnseenShopItems: boolean;
    hasSeenShopCinematic: boolean;
    
    // New Quantum Path system
    chosenQuantumPath: QuantumPathType | null;
    quantumPathLevel: number;
    hasInteractedWithQuantumCore: boolean;
    
    // Gift System
    activeGift: { value: number; timestamp: number } | null;

    // New stats
    timePlayedInSeconds: number;

    // New message center
    messageLog: Notification[];
}
