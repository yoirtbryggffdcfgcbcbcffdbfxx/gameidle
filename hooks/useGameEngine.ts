import { useEffect, useMemo, useCallback, useState, useRef } from 'react';

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
import { CLICK_POWER, PARTICLE_COLORS } from '../constants';
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

    const gameState = useGameState(handleAchievementUnlock, handleShowAscensionTutorial, appState);
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
        coreBonuses,
        hasSeenCoreTutorial,
        setHasSeenCoreTutorial
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

    const productionTotalRef = useRef(productionTotal);
    const addFloatingTextRef = useRef(addFloatingText);
    const memoizedFormatNumberRef = useRef(memoizedFormatNumber);
    const isCoreDischargingRef = useRef(isCoreDischarging);
    useEffect(() => {
        productionTotalRef.current = productionTotal;
        addFloatingTextRef.current = addFloatingText;
        memoizedFormatNumberRef.current = memoizedFormatNumber;
        isCoreDischargingRef.current = isCoreDischarging;
    }, [productionTotal, addFloatingText, memoizedFormatNumber, isCoreDischarging]);
    
    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        
        const productionTimer = setInterval(() => {
            const currentProduction = productionTotalRef.current;
            if (currentProduction > 0 && !isCoreDischargingRef.current) {
                addFloatingTextRef.current(`+${memoizedFormatNumberRef.current(currentProduction)}`, window.innerWidth / 3, window.innerHeight / 2, '#00ffcc');
            }
        }, 1000);

        return () => clearInterval(productionTimer);
    }, [isLoaded, appState]);

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

    const handleBuyUpgrade = (index: number) => {
        const upgradeId = gameState.upgrades[index].id;
        if (gameState.buyUpgrade(index)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            unlockAchievement("Premier Investissement");
            if (popups.tutorialStep === 3 && upgradeId === 'gen_1') {
                popups.setTutorialStep(4);
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

    const handleConfirmHardReset = () => {
        playSfx('click');
        gameState.resetGame(true);
        popups.setActivePopup(null);
        popups.setShowHardResetConfirm(false);
        addNotification("Jeu réinitialisé.", 'info');
    }
    
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
        startNewGame();
        addNotification("Nouvelle partie commencée.", 'info');
    };

    // --- DEV HANDLERS ---
    const devHandlers = {
        addEnergy: () => gameState.setEnergy(maxEnergy),
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
            ascensionBonuses: gameState.ascensionBonuses,
            achievementBonuses: gameState.achievementBonuses,
            coreCharge,
            isCoreDischarging,
            quantumShards,
            purchasedCoreUpgrades,
            coreBonuses,
            productionTotal,
            clickPower: totalClickPower,
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
            activePopup: popups.activePopup,
            tutorialStep: popups.tutorialStep,
            showHardResetConfirm: popups.showHardResetConfirm,
            showAscensionConfirm: popups.showAscensionConfirm,
            showAscensionTutorial: popups.showAscensionTutorial,
            showDevPanel,
            showCoreTutorial,
        },

        handlers: {
            onCollect: handleCollect,
            onBuyUpgrade: handleBuyUpgrade,
            onAscend: handleAscendAttempt,
            onConfirmAscension: confirmAscension,
            onBuyAscensionUpgrade: handleBuyAscensionUpgrade,
            onBuyCoreUpgrade: handleBuyCoreUpgrade,
            onConfirmHardReset: handleConfirmHardReset,
            onSettingsChange: handleSettingsChange,
            onDischargeCore: handleDischargeCore,
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
        removeParticle,
        removeFloatingText,
    };
};