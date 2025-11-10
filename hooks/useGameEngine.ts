// hooks/useGameEngine.ts
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
import { CLICK_POWER, PARTICLE_COLORS, BANK_CONSTRUCTION_COST } from '../constants';
import { formatNumber } from '../utils/helpers';

export const useGameEngine = () => {
    const { settings, setSettings, handleSettingsChange, appState, setAppState } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.showFloatingText);
    const [showDevPanel, setShowDevPanel] = useState(false);
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const notificationIdCounter = useRef(0);
    const transitionedToMenu = useRef(false);

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

    const { gameState, computed, actions, dev, loadStatus, saveGameState } = useGameState(handleAchievementUnlock, handleShowAscensionTutorial, handleLoanRepaid, handleBankUnlockedFirstTime, appState);

    const totalClickPower = useMemo(() => {
        // FIX: Access `clickPowerFromUpgrades` from the `computed` object.
        return (CLICK_POWER + computed.clickPowerFromUpgrades + gameState.ascensionLevel) * computed.ascensionBonuses.clickMultiplier * computed.achievementBonuses.click;
    }, [computed.clickPowerFromUpgrades, gameState.ascensionLevel, computed.ascensionBonuses.clickMultiplier, computed.achievementBonuses.click]);
    
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);
    const formattedEnergy = useMemo(() => memoizedFormatNumber(gameState.energy), [gameState.energy, memoizedFormatNumber]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                setShowDevPanel(prev => !prev);
                if(!showDevPanel) actions.unlockAchievement("Développeur Honoraire");
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDevPanel, actions]);

    useEffect(() => {
        if (loadStatus !== 'loading' && !transitionedToMenu.current) {
            transitionedToMenu.current = true;
            // Introduce a minimum display time for the loading screen animation.
            const timer = setTimeout(() => {
                setAppState('menu');
            }, 1500); // 1.5 seconds to allow animation to complete.

            return () => clearTimeout(timer);
        }
    }, [loadStatus, setAppState]);

    useEffect(() => {
        if (loadStatus === 'loading' || appState !== 'game') return;
        const saveTimer = setInterval(() => saveGameState(settings), 5000);
        return () => clearInterval(saveTimer);
    }, [saveGameState, settings, loadStatus, appState]);
    
    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const newEnergy = actions.incrementClickCount(totalClickPower);
        
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${memoizedFormatNumber(totalClickPower)}`, e.clientX, e.clientY, '#ffffff');
        actions.unlockAchievement("Étincelle Initiale");

        if (popups.tutorialStep === 1) {
            popups.setTutorialStep(2);
        }
    };

    const handleBuyUpgrade = (index: number, amount: number | 'MAX') => {
        const upgrade = gameState.upgrades[index];
        if (actions.buyUpgrade(index, amount)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            actions.unlockAchievement("Premier Investissement");
            if (popups.tutorialStep === 4 && upgrade.id === 'gen_1') {
                popups.setTutorialStep(5);
            }
        } else {
            addNotification("Pas assez d'énergie !", 'error');
        }
    };
    
    const confirmAscension = () => {
        if (actions.doAscension()) {
            actions.unlockAchievement("Au-delà du Voile");
            addNotification(`Ascension effectuée ! Vous gagnez ${computed.ascensionGain} point et ${computed.ascensionGain} Fragment.`, 'info', { title: "Ascension !" });
        }
        popups.setShowAscensionConfirm(false);
    };
    
    const handleDischargeCore = () => {
        if (actions.dischargeCore()) {
            playSfx('buy'); // Use a powerful sound
            if (!gameState.hasSeenCoreTutorial) {
                setShowCoreTutorial(true);
                actions.setHasSeenCoreTutorial(true);
            } else {
                addNotification(`Cœur quantique activé ! Production x${computed.coreBonuses.multiplier.toFixed(1)} pendant 10s !`, 'info', { title: 'SURCHARGE !'});
            }
            actions.unlockAchievement("Surcharge Quantique");
        }
    }

    const handleAscendAttempt = () => {
        if (!computed.canAscend) return;
        if (settings.confirmAscension) {
            popups.setShowAscensionConfirm(true);
        } else {
            confirmAscension();
        }
    };

    const handleBuyAscensionUpgrade = (id: string) => {
        if (actions.buyAscensionUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration d'ascension achetée !", 'info');
        } else {
            addNotification("Pas assez de points d'ascension !", 'error');
        }
    };

    const handleBuyCoreUpgrade = (id: string) => {
        if (actions.buyCoreUpgrade(id)) {
            playSfx('buy');
            addNotification("Réacteur du cœur amélioré !", 'info');
        } else {
            addNotification("Pas assez de fragments quantiques !", 'error');
        }
    };

    const handleBuyShopUpgrade = (id: string) => {
        if (actions.buyShopUpgrade(id)) {
            playSfx('buy');
            addNotification("Amélioration permanente achetée !", 'info');
        } else {
            addNotification("Pas assez de Fragments Quantiques !", 'error');
        }
    };

    const handleConfirmHardReset = () => {
        playSfx('click');
        actions.resetGame(true);
        popups.setShowHardResetConfirm(false);
        addNotification("Jeu réinitialisé.", 'info');
    }
    
    const handleBuildBank = () => {
        if (actions.buildBank(BANK_CONSTRUCTION_COST)) {
            playSfx('buy');
            addNotification("Banque construite ! L'épargne et les prêts sont disponibles.", 'info', { title: 'Système Bancaire en Ligne' });
        } else {
            addNotification("Pas assez d'énergie pour construire la banque.", 'error');
        }
    };
    
    const handleDepositSavings = (amount: number) => {
        if (actions.depositSavings(amount)) {
            playSfx('click');
            addNotification(`${memoizedFormatNumber(amount)} énergie déposée.`, 'info');
        } else {
            addNotification("Montant invalide ou pas assez d'énergie.", 'error');
        }
    };

    const handleWithdrawSavings = (amount: number) => {
        if (amount > gameState.savingsBalance) {
            addNotification("Pas assez d'épargne pour retirer ce montant.", 'error');
            return;
        }
        const result = actions.withdrawSavings(amount);
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
        const result = actions.takeOutLoan(amount);
        if (result.success) {
            playSfx('buy');
            addNotification(`Prêt de ${memoizedFormatNumber(amount)} énergie obtenu.`, 'info', { title: 'Prêt Approuvé' });
        } else {
             let message = "Impossible d'obtenir le prêt.";
             switch (result.reason) {
                case 'loan_exists': message = "Vous avez déjà un prêt en cours."; break;
                case 'exceeds_max': message = `Le prêt ne peut pas dépasser 10% de votre capacité max (${memoizedFormatNumber(computed.maxEnergy * 0.1)}).`; break;
                case 'insufficient_collateral':
                    const repaymentTotal = amount * (1 + computed.bankBonuses.loanInterest);
                    const requiredCollateral = repaymentTotal * 0.10;
                    message = `Vous devez posséder au moins 10% du total à rembourser (${memoizedFormatNumber(requiredCollateral)}) pour ce prêt.`; break;
                case 'invalid_amount': message = "Le montant du prêt est invalide."; break;
             }
             addNotification(message, 'error');
        }
    };
    
    const handleUpgradeBank = () => {
        const result = actions.upgradeBank();
        if (result.success && result.newLevel) {
            playSfx('buy');
            addNotification(`Banque améliorée au niveau ${result.newLevel}!`, 'info', { title: 'Amélioration Bancaire' });
        } else {
            let message = "Amélioration impossible.";
            if (result.reason === 'max_level') message = "La banque est déjà au niveau maximum.";
            if (result.reason === 'insufficient_energy') message = "Pas assez d'énergie pour l'amélioration.";
            if (result.reason === 'loan_active') message = "Vous ne pouvez pas améliorer la banque avec un prêt en cours.";
            addNotification(message, 'error');
        }
    };

    const startNewGame = () => {
        actions.resetGame(true);
        setSettings(s => ({...s, theme: s.theme})); // Re-apply theme
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
        if (loadStatus === 'has_save') {
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
        actions.unlockAchievement("Curieux");
    }

    const handleConfirmNewGame = () => {
        playSfx('click');
        popups.setShowNewGameConfirm(false);
        setAppState('cinematic');
    };

    return {
        appState,
        hasSaveData: loadStatus === 'has_save',
        playSfx,
        memoizedFormatNumber,
        removeNotification,

        gameState,
        // FIX: Add `clickPower` to computedState for UI components.
        computedState: { ...computed, formattedEnergy, clickPower: totalClickPower },

        uiState: {
            settings,
            particles,
            floatingTexts,
            notifications,
            activePopup: popups.activePopup,
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
            dev,
        },
        
        popups,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowBankInfoPopup: popups.setShowBankInfoPopup,
        removeParticle,
        removeFloatingText,
        addFloatingText,
        // FIX: Export setShowDevPanel to be used in GameUI.
        setShowDevPanel,
    };
};