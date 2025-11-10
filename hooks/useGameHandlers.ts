import React from 'react';
import { GameState, Settings, Achievement, Notification } from '../types';
import { useGameState } from './useGameState';
import { usePopupManager } from './usePopupManager';
import { PARTICLE_COLORS, BANK_CONSTRUCTION_COST } from '../constants';
import { formatNumber } from '../utils/helpers';

// Define a type for the arguments object to make it cleaner
type GameHandlersProps = {
    gameState: GameState;
    // FIX: Directly use the return type of `useGameState` to avoid circular type dependencies.
    computed: ReturnType<typeof useGameState>['computed'];
    actions: ReturnType<typeof useGameState>['actions'];
    dev: ReturnType<typeof useGameState>['dev'];
    settings: Settings;
    popups: ReturnType<typeof usePopupManager>;
    playSfx: (sound: 'click' | 'buy' | 'ui_hover') => void;
    addParticle: (x: number, y: number, color: string) => void;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    addNotification: (message: string, type: Notification['type'], options?: { title?: string; achievement?: Achievement }) => void;
    setAppState: React.Dispatch<React.SetStateAction<'loading' | 'menu' | 'game' | 'cinematic'>>;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    hasSaveData: boolean;
    unlockAudio: () => void;
    setShowCoreTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

// This is a trick to get nested return types without exporting them
// We won't actually call this, it's just for TypeScript
// FIX: Removed declare module block that was causing circular type references.
/*
declare module './useGameEngine' {
  interface useGameEngine {
    __internal_for_type_only_useGameState: typeof import('./useGameState').useGameState;
  }
}
*/

export const useGameHandlers = ({
    gameState, computed, actions, dev, settings, popups,
    playSfx, addParticle, addFloatingText, addNotification,
    setAppState, setSettings, hasSaveData, unlockAudio, setShowCoreTutorial
}: GameHandlersProps) => {

    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const clickPower = computed.clickPower;
        actions.incrementClickCount(clickPower);
        
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${formatNumber(clickPower, settings.scientificNotation)}`, e.clientX, e.clientY, '#ffffff');
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
        setAppState('menu'); // Go back to menu after reset
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
            addNotification(`${formatNumber(amount, false)} énergie déposée.`, 'info');
        } else {
            addNotification("Montant invalide ou pas assez d'énergie.", 'error');
        }
    };

    const handleWithdrawSavings = (amount: number) => {
        const result = actions.withdrawSavings(amount);
        if (result.success) {
            playSfx('click');
            let message = '';
            if (result.repaidAmount && result.repaidAmount > 0) {
                message = `${formatNumber(result.repaidAmount, false)} a remboursé votre prêt.`;
                if (result.toEnergyAmount && result.toEnergyAmount > 0) {
                    message += ` ${formatNumber(result.toEnergyAmount, false)} a été ajouté à votre énergie.`;
                }
            } else {
                message = `${formatNumber(result.withdrawnAmount || 0, false)} énergie retirée.`;
            }
            addNotification(message, 'info');
        } else {
            addNotification("Montant invalide ou solde insuffisant.", 'error');
        }
    };

    const handleTakeOutLoan = (amount: number) => {
        const result = actions.takeOutLoan(amount);
        if (result.success) {
            playSfx('buy');
            addNotification(`Prêt de ${formatNumber(amount, false)} énergie obtenu.`, 'info', { title: 'Prêt Approuvé' });
        } else {
             let message = "Impossible d'obtenir le prêt.";
             switch (result.reason) {
                case 'loan_exists': message = "Vous avez déjà un prêt en cours."; break;
                case 'exceeds_max': message = `Le prêt ne peut pas dépasser 10% de votre capacité max (${formatNumber(computed.maxEnergy * 0.1, false)}).`; break;
                case 'insufficient_collateral':
                    const repaymentTotal = amount * (1 + computed.bankBonuses.loanInterest);
                    const requiredCollateral = repaymentTotal * 0.10;
                    message = `Vous devez posséder au moins 10% du total à rembourser (${formatNumber(requiredCollateral, false)}) pour ce prêt.`; break;
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
    
    // --- App Flow Handlers ---
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
        if (hasSaveData) {
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
    
    // FIX: Removed invalid 'await' from inside a non-async function. The import was moved to the top of the file.
    

    return {
        onCollect: handleCollect,
        onBuyUpgrade: handleBuyUpgrade,
        onAscend: handleAscendAttempt,
        onConfirmAscension: confirmAscension,
        onBuyAscensionUpgrade: handleBuyAscensionUpgrade,
        onBuyCoreUpgrade: handleBuyCoreUpgrade,
        onBuyShopUpgrade: handleBuyShopUpgrade,
        onConfirmHardReset: handleConfirmHardReset,
        onSettingsChange: (newSettings: Partial<Settings>) => setSettings(s => ({ ...s, ...newSettings })),
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
    };
};