// FIX: Import the `React` namespace to resolve the type `React.MouseEvent`.
import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';

// Hooks
import { useGameState } from './useGameState';
import { useSettings } from './useSettings';
import { usePopupManager } from './usePopupManager';
import { useParticleSystem } from './useParticleSystem';
import { useSfx } from './useSfx';
import { useFloatingText } from './useFloatingText';

// Types
import { Achievement, Notification } from '../types';

// Constants & Helpers
import { CLICK_POWER, PARTICLE_COLORS, BANK_CONSTRUCTION_COST, BANK_UPGRADES } from '../constants';
import { formatNumber } from '../utils/helpers';

/**
 * The main game engine hook.
 * Encapsulates all game logic, state management, and side effects.
 */
export const useGameEngine = () => {
    const { settings, setSettings, handleSettingsChange, appState, setAppState } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.showFloatingText);
    const [showDevPanel, setShowDevPanel] = useState(false);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationIdCounter = useRef(0);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback((
        message: string,
        type: Notification['type'],
        options: { title?: string; achievement?: Achievement } = {}
    ) => {
        const id = notificationIdCounter.current++;
        const newNotification: Notification = {
            id,
            message,
            type,
            title: options.title,
            achievement: options.achievement,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const popups = usePopupManager();
    const [showCoreTutorial, setShowCoreTutorial] = useState(false);
    const [showBankTutorial, setShowBankTutorial] = useState(false);

    const handleAchievementUnlock = useCallback((achievement: Achievement) => {
        playSfx('buy');
        addNotification(achievement.description, 'achievement', {
            title: "Succès Débloqué!",
            achievement: achievement,
        });
    }, [addNotification, playSfx]);
    
    const handleShowAscensionTutorial = useCallback(() => {
        popups.setShowAscensionTutorial(true);
    }, [popups]);
    
    const handleLoanRepaid = useCallback(() => {
        addNotification("Votre prêt a été entièrement remboursé !", 'info', { title: "Prêt Remboursé" });
    }, [addNotification]);
    
    const handleBankUnlockedFirstTime = useCallback(() => {
        setShowBankTutorial(true);
    }, []);


    const gameState = useGameState(handleAchievementUnlock, handleShowAscensionTutorial, handleLoanRepaid, handleBankUnlockedFirstTime, appState);
    const { 
        energy, 
        productionTotal,
        clickPowerFromUpgrades,
        ascensionLevel,
        ascensionPoints, 
        ascensionBonuses, 
        achievementBonuses,
        canAscend,
        ascensionGain,
        maxEnergy,
        isLoaded,
        unlockAchievement,
        incrementClickCount,
        unlockedUpgradesForCurrentAscension,
        unlockedUpgradesAtMaxLevelCount,
        coreCharge,
        isCoreDischarging,
        quantumShards,
        purchasedCoreUpgrades,
        purchasedShopUpgrades,
        coreBonuses,
        hasSeenCoreTutorial,
        setHasSeenCoreTutorial,
        totalEnergyProduced,
        isBankUnlocked,
        savingsBalance,
        currentLoan,
        bankLevel,
        bankBonuses,
        costMultiplier
    } = gameState;

    const totalClickPower = useMemo(() => {
        return (CLICK_POWER + clickPowerFromUpgrades + ascensionLevel) * ascensionBonuses.clickMultiplier * achievementBonuses.click;
    }, [clickPowerFromUpgrades, ascensionLevel, ascensionBonuses.clickMultiplier, achievementBonuses.click]);
    
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);
    const formattedEnergy = useMemo(() => memoizedFormatNumber(energy), [energy, memoizedFormatNumber]);
    
    // Dev Panel keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                setShowDevPanel(prev => !prev);
                if(!showDevPanel) unlockAchievement("Développeur Honoraire");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDevPanel, unlockAchievement]);

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => setAppState('menu'), 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, setAppState]);

    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const saveTimer = setInterval(() => gameState.saveGameState(settings), 5000);
        return () => clearInterval(saveTimer);
    }, [gameState, settings, isLoaded, appState]);
    
    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        incrementClickCount();
        const newEnergy = Math.min(energy + totalClickPower, maxEnergy);
        gameState.setEnergy(newEnergy);
        
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${memoizedFormatNumber(totalClickPower)}`, e.clientX, e.clientY, '#ffffff');
        unlockAchievement("Étincelle Initiale");

        if (popups.tutorialStep === 1) {
            popups.setTutorialStep(2);
        }
    };

    const handleBuyUpgrade = (index: number, amount: number | 'MAX') => {
        const upgrade = gameState.upgrades[index];
        if (gameState.buyUpgrade(index, amount)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            unlockAchievement("Premier Investissement");
            if (popups.tutorialStep === 4 && upgrade.id === 'gen_1') {
                popups.setTutorialStep(5);
            }
        } else {
            addNotification("Pas assez d'énergie !", 'error');
        }
    };
    
    const confirmAscension = () => {
        if (gameState.doAscension()) {
            unlockAchievement("Au-delà du Voile");
            addNotification(`Ascension effectuée ! Vous gagnez ${ascensionGain} point et ${ascensionGain} Fragment.`, 'info', { title: "Ascension !" });
        }
        popups.setShowAscensionConfirm(false);
    };
    
    const handleDischargeCore = () => {
        if (gameState.dischargeCore()) {
            playSfx('buy'); // Use a powerful sound
            if (!hasSeenCoreTutorial) {
                setShowCoreTutorial(true);
                setHasSeenCoreTutorial(true);
            } else {
                addNotification(`Cœur quantique activé ! Production x${coreBonuses.multiplier.toFixed(1)} pendant 10s !`, 'info', { title: 'SURCHARGE !'});
            }
            unlockAchievement("Surcharge Quantique");
        }
    }

    const handleAscendAttempt = () => {
        if (!canAscend) return;
        if (settings.confirmAscension) {
            popups.setShowAscensionConfirm(true);
        } else {
            confirmAscension();
        }
    };

    const handleBuyAscensionUpgrade = (id: string) => {
        if (gameState.buyAscensionUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration d'ascension achetée !", 'info');
        } else {
            addNotification("Pas assez de points d'ascension !", 'error');
        }
    };

    const handleBuyCoreUpgrade = (id: string) => {
        if (gameState.buyCoreUpgrade(id)) {
            playSfx('buy');
            addNotification("Réacteur du cœur amélioré !", 'info');
        } else {
            addNotification("Pas assez de fragments quantiques !", 'error');
        }
    };

    const handleBuyShopUpgrade = (id: string) => {
        if (gameState.buyShopUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration permanente achetée !", 'info');
        } else {
            addNotification("Pas assez de Fragments Quantiques !", 'error');
        }
    };

    const handleConfirmHardReset = () => {
        playSfx('click');
        gameState.resetGame(true);
        popups.setShowHardResetConfirm(false);
        addNotification("Jeu réinitialisé.", 'info');
    }
    
    const handleBuildBank = () => {
        if (gameState.buildBank(BANK_CONSTRUCTION_COST)) {
            playSfx('buy');
            addNotification("Banque construite ! L'épargne et les prêts sont disponibles.", 'info', { title: 'Système Bancaire en Ligne' });
        } else {
            addNotification("Pas assez d'énergie pour construire la banque.", 'error');
        }
    };
    
    const handleDepositSavings = (amount: number) => {
        if (gameState.depositSavings(amount)) {
            playSfx('click');
            addNotification(`${memoizedFormatNumber(amount)} énergie déposée.`, 'info');
        } else {
            addNotification("Montant invalide ou pas assez d'énergie.", 'error');
        }
    };

    const handleWithdrawSavings = (amount: number, isPercentage: boolean) => {
        if (!isPercentage && amount > savingsBalance) {
            addNotification("Pas assez d'épargne pour retirer ce montant.", 'error');
            return;
        }

        const result = gameState.withdrawSavings(amount);
        
        if (result.success) {
            playSfx('click');
            let message = '';
            if (result.repaidAmount && result.repaidAmount > 0) {
                message = `${memoizedFormatNumber(result.repaidAmount)} a remboursé votre prêt.`;
                if (result.toEnergyAmount && result.toEnergyAmount > 0) {
                    message += ` ${memoizedFormatNumber(result.toEnergyAmount)} a été ajouté à votre énergie.`;
                }
            } else {
                message = `${memoizedFormatNumber(result.withdrawnAmount || 0)} énergie retirée.`;
            }
            addNotification(message, 'info');
        } else {
            addNotification("Montant invalide ou solde nul.", 'error');
        }
    };

    const handleTakeOutLoan = (amount: number) => {
        const result = gameState.takeOutLoan(amount);
        if (result.success) {
            playSfx('buy');
            addNotification(`Prêt de ${memoizedFormatNumber(amount)} énergie obtenu.`, 'info', { title: 'Prêt Approuvé' });
        } else {
             let message = "Impossible d'obtenir le prêt.";
             switch (result.reason) {
                case 'loan_exists':
                    message = "Vous avez déjà un prêt en cours.";
                    break;
                case 'exceeds_max':
                    message = `Le montant du prêt ne peut pas dépasser 10% de votre capacité maximale (${memoizedFormatNumber(maxEnergy * 0.1)}).`;
                    break;
                case 'insufficient_collateral':
                    const repaymentTotal = amount * (1 + bankBonuses.loanInterest);
                    const requiredCollateral = repaymentTotal * 0.10;
                    message = `Vous devez posséder au moins 10% du total à rembourser (${memoizedFormatNumber(requiredCollateral)}) pour obtenir ce prêt.`;
                    break;
                case 'invalid_amount':
                    message = "Le montant du prêt est invalide.";
                    break;
             }
             addNotification(message, 'error');
        }
    };
    
    const handleUpgradeBank = () => {
        const result = gameState.upgradeBank();
        if (result.success) {
            playSfx('buy');
            const nextUpgradeInfo = BANK_UPGRADES[result.newLevel || 0];
            addNotification(`Banque améliorée au niveau ${result.newLevel}! ${nextUpgradeInfo.description}`, 'info', { title: 'Amélioration Bancaire' });
        } else {
            let message = "Amélioration impossible.";
            if (result.reason === 'max_level') message = "La banque est déjà au niveau maximum.";
            if (result.reason === 'insufficient_energy') message = "Pas assez d'énergie pour l'amélioration.";
            if (result.reason === 'loan_active') message = "Vous ne pouvez pas améliorer la banque avec un prêt en cours.";
            addNotification(message, 'error');
        }
    };

    const startNewGame = () => {
        gameState.resetGame(true);
        setSettings(s => ({...s, theme: s.theme}));
        popups.setTutorialStep(1);
        setAppState('game');
    };

    const handleContinue = () => {
        playSfx('click');
        unlockAudio();
        setAppState('game');
    };

    const handleNewGameClick = () => {
        playSfx('click');
        unlockAudio();
        if (gameState.hasSaveData) {
            popups.setShowNewGameConfirm(true);
        } else {
            setAppState('cinematic');
        }
    };
    
    const handleStartGameAfterCinematic = () => {
        startNewGame();
    };
    
    const handleCreditsClick = () => {
        playSfx('ui_hover');
        popups.setActivePopup('credits');
        unlockAchievement("Curieux");
    }

    const handleConfirmNewGame = () => {
        playSfx('click');
        popups.setShowNewGameConfirm(false);
        setAppState('cinematic');
    };

    // --- DEV HANDLERS ---
    const devHandlers = {
        addEnergy: () => gameState.dev_setEnergy(maxEnergy),
        addSpecificEnergy: (amount: number) => gameState.dev_addEnergy(amount),
        addAscension: () => gameState.dev_addAscension(),
        unlockAllUpgrades: () => gameState.dev_unlockAllUpgrades(),
        unlockAllAchievements: () => gameState.dev_unlockAllAchievements(),
        resetAchievements: () => gameState.dev_resetAchievements(),
        closePanel: () => setShowDevPanel(false)
    };

    return {
        appState,
        hasSaveData: gameState.hasSaveData,
        playSfx,
        memoizedFormatNumber,
        removeNotification,

        gameState: {
            energy: gameState.energy,
            upgrades: gameState.upgrades,
            visibleUpgrades: gameState.visibleUpgrades,
            achievements: gameState.achievements,
            ascensionLevel: gameState.ascensionLevel,
            ascensionPoints: gameState.ascensionPoints,
            purchasedAscensionUpgrades: gameState.purchasedAscensionUpgrades,
            purchasedShopUpgrades: gameState.purchasedShopUpgrades,
            ascensionBonuses: gameState.ascensionBonuses,
            achievementBonuses: gameState.achievementBonuses,
            coreCharge,
            isCoreDischarging,
            quantumShards,
            purchasedCoreUpgrades,
            coreBonuses,
            productionTotal,
            clickPower: totalClickPower,
            totalEnergyProduced,
            isBankUnlocked,
            savingsBalance,
            currentLoan,
            bankLevel,
            bankBonuses,
            costMultiplier: gameState.costMultiplier,
        },
        
        computedState: {
            canAscend: gameState.canAscend,
            ascensionGain: gameState.ascensionGain,
            totalUpgradesOwned: gameState.totalUpgradesOwned,
            unlockedUpgradesForCurrentAscensionCount: unlockedUpgradesForCurrentAscension.length,
            unlockedUpgradesAtMaxLevelCount,
            maxEnergy,
            formattedEnergy,
        },

        uiState: {
            settings,
            particles,
            floatingTexts,
            notifications,
            activePopup: popups.activePopup, // Still used for confirmation dialogs, etc.
            tutorialStep: popups.tutorialStep,
            showHardResetConfirm: popups.showHardResetConfirm,
            showAscensionConfirm: popups.showAscensionConfirm,
            showAscensionTutorial: popups.showAscensionTutorial,
            showDevPanel,
            showCoreTutorial,
            showBankTutorial,
            showBankInfoPopup: popups.showBankInfoPopup,
        },

        handlers: {
            onCollect: handleCollect,
            onBuyUpgrade: handleBuyUpgrade,
            onAscend: handleAscendAttempt,
            onConfirmAscension: confirmAscension,
            onBuyAscensionUpgrade: handleBuyAscensionUpgrade,
            onBuyCoreUpgrade: handleBuyCoreUpgrade,
            onBuyShopUpgrade: handleBuyShopUpgrade,
            onConfirmHardReset: handleConfirmHardReset,
            onSettingsChange: handleSettingsChange,
            onDischargeCore: handleDischargeCore,
            onBuildBank: handleBuildBank,
            onDepositSavings: handleDepositSavings,
            onWithdrawSavings: handleWithdrawSavings,
            onTakeOutLoan: handleTakeOutLoan,
            onUpgradeBank: handleUpgradeBank,
            handleContinue,
            handleNewGameClick,
            handleConfirmNewGame,
            handleCreditsClick,
            handleStartGameAfterCinematic,
            unlockSpecificUpgrade: gameState.unlockSpecificUpgrade,
            dev: devHandlers,
        },
        
        popups,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowBankInfoPopup: popups.setShowBankInfoPopup,
        removeParticle,
        removeFloatingText,
        // FIX: Expose addFloatingText so it can be passed to child components.
        addFloatingText,
    };
};