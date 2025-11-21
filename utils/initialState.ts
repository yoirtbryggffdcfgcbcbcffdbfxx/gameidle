
import { GameState } from '../types';
import { INITIAL_UPGRADES } from '../data/upgrades';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

export const getInitialState = (): GameState => {
    const upgradesWithState = INITIAL_UPGRADES.map(u => ({
        ...u,
        owned: 0,
        tier: 0, // Initial tier
        currentCost: u.baseCost,
    }));

    return {
        energy: 0,
        upgrades: upgradesWithState,
        ascensionLevel: 0,
        ascensionPoints: 0,
        achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a})),
        purchasedAscensionUpgrades: ['start'],
        // FIX: Initialize purchasedCoreUpgrades in the initial state.
        purchasedCoreUpgrades: ['core_start'],
        totalClicks: 0,
        hasSeenAscensionTutorial: false,
        coreCharge: 0,
        isCoreDischarging: false,
        coreDischargeEndTimestamp: null,
        quantumShards: 0,
        hasSeenCoreTutorial: false,
        totalEnergyProduced: 0,
        isBankUnlocked: false,
        isBankDiscovered: false,
        savingsBalance: 0,
        currentLoan: null,
        bankLevel: 0,
        hasSeenBankTutorial: false,
        loanTier: 0,
        purchasedShopUpgrades: [],
        productionHistory: [],
        seenUpgrades: [],
        viewedCategories: [],
        isShopUnlocked: false,
        isCoreUnlocked: false,
        hasUnseenShopItems: false,
        hasSeenShopCinematic: false,
        
        // New Quantum Path system
        chosenQuantumPath: null,
        quantumPathLevel: 0,
        hasInteractedWithQuantumCore: false,
        
        // Gift System
        activeGift: null,

        // New stats
        timePlayedInSeconds: 0,

        // New message center
        messageLog: [],
    };
};
