import React, { useEffect, useMemo, useCallback } from 'react';

// Hooks
import { useGameState } from './hooks/useGameState';
import { useSettings } from './hooks/useSettings';
import { usePopupManager } from './hooks/usePopupManager';
import { useParticleSystem } from './hooks/useParticleSystem';
import { useNotifier } from './hooks/useNotifier';
import { useSfx } from './hooks/useSfx';
import { useFloatingText } from './hooks/useFloatingText';

// Constants & Helpers
import { CLICK_POWER, PARTICLE_COLORS } from './constants';
import { formatNumber } from './utils/helpers';

// Components
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';

const App: React.FC = () => {
    const { settings, setSettings, handleSettingsChange, appState, setAppState } = useSettings();
    const { playSfx, unlockAudio } = useSfx(settings.sfxVolume);
    const { notification, showNotification } = useNotifier();
    const { particles, addParticle, removeParticle } = useParticleSystem(settings.visualEffects);
    const { floatingTexts, addFloatingText, removeFloatingText } = useFloatingText(settings.floatingText);
    
    const {
        activePopup,
        showTutorial,
        showHardResetConfirm,
        showNewGameConfirm,
        showPrestigeConfirm,
        setActivePopup,
        setShowTutorial,
        setShowHardResetConfirm,
        setShowNewGameConfirm,
        setShowPrestigeConfirm,
    } = usePopupManager();

    const {
        energy, setEnergy,
        upgrades,
        prestigeCount,
        productionTotal,
        prestigeBonuses,
        purchasedPrestigeUpgrades,
        achievements,
        totalUpgradesOwned,
        canPrestige,
        prestigeGain,
        isLoaded,
        hasSaveData,
        saveGameState,
        buyUpgrade,
        doPrestige,
        buyPrestigeUpgrade,
        resetGame,
        unlockAchievement,
    } = useGameState();
    
    // FIX: Hoist memoized formatters to be declared before they are used in useEffect hooks.
    const formattedEnergy = useMemo(() => formatNumber(energy, settings.scientificNotation), [energy, settings.scientificNotation]);
    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => setAppState('menu'), 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, setAppState]);
    
    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const saveTimer = setInterval(() => saveGameState(settings), 5000);
        const productionTimer = setInterval(() => {
            if (productionTotal > 0) {
                addFloatingText(`+${memoizedFormatNumber(productionTotal)}`, window.innerWidth * 0.25, 60, '#00ffcc');
            }
        }, 1000);
        return () => {
            clearInterval(saveTimer);
            clearInterval(productionTimer);
        }
    }, [saveGameState, settings, isLoaded, appState, productionTotal, addFloatingText, memoizedFormatNumber]);
    
    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const clickValue = (CLICK_POWER + prestigeCount) * prestigeBonuses.clickMultiplier;
        setEnergy(prev => Math.min(prev + clickValue, 10000));
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
        addFloatingText(`+${memoizedFormatNumber(clickValue)}`, e.clientX, e.clientY, '#ffffff');
        if (unlockAchievement("Premier Clic")) {
            showNotification("Succès débloqué : Premier Clic");
        }
    };

    const handleBuyUpgrade = (index: number) => {
        if (buyUpgrade(index)) {
            playSfx('buy');
            addParticle(window.innerWidth / 2, window.innerHeight / 2, PARTICLE_COLORS.BUY);
            if (unlockAchievement("Premier Achat")) {
                showNotification("Succès débloqué : Premier Achat");
            }
        } else {
            showNotification("Pas assez d'énergie !");
        }
    };

    useEffect(() => {
        if (appState !== 'game') return;
        if (totalUpgradesOwned >= 10 && unlockAchievement("Collectionneur")) showNotification("Succès débloqué : Collectionneur");
        if (totalUpgradesOwned >= 50 && unlockAchievement("Magnat")) showNotification("Succès débloqué : Magnat");
        if (totalUpgradesOwned >= 200 && unlockAchievement("Empereur Industriel")) showNotification("Succès débloqué : Empereur Industriel");

        if (energy >= 100 && unlockAchievement("Milliardaire en Énergie")) showNotification("Succès débloqué : Milliardaire en Énergie");
        if (energy >= 1000 && unlockAchievement("Magnat de l'Énergie")) showNotification("Succès débloqué : Magnat de l'Énergie");
        if (energy >= 10000 && unlockAchievement("Divinité Énergétique")) showNotification("Succès débloqué : Divinité Énergétique");

        if (productionTotal >= 10 && unlockAchievement("Début de Production")) showNotification("Succès débloqué : Début de Production");
        if (productionTotal >= 100 && unlockAchievement("Automatisation")) showNotification("Succès débloqué : Automatisation");
        if (productionTotal >= 1000 && unlockAchievement("Puissance Industrielle")) showNotification("Succès débloqué : Puissance Industrielle");
        if (productionTotal >= 10000 && unlockAchievement("Singularité Productive")) showNotification("Succès débloqué : Singularité Productive");
        
        if (prestigeCount >= 5 && unlockAchievement("Prestigieux")) showNotification("Succès débloqué : Prestigieux");
        if (prestigeCount >= 25 && unlockAchievement("Légende du Prestige")) showNotification("Succès débloqué : Légende du Prestige");

    }, [totalUpgradesOwned, energy, productionTotal, prestigeCount, unlockAchievement, showNotification, appState]);
    
    const handlePrestigeAttempt = () => {
        if (!canPrestige) return;
        if (settings.confirmPrestige) {
            setShowPrestigeConfirm(true);
        } else {
            confirmPrestige();
        }
    };

    const confirmPrestige = () => {
        const newPrestigeCount = prestigeCount + prestigeGain;
        if (doPrestige()) {
            if (unlockAchievement("Première Prestige")) {
                showNotification("Succès débloqué : Première Prestige");
            }
            showNotification(`Prestige x${newPrestigeCount} obtenu !`);
        }
        setShowPrestigeConfirm(false);
    };
    
    const handleBuyPrestigeUpgrade = (id: string) => {
        if (buyPrestigeUpgrade(id)) {
            playSfx('buy');
            showNotification("Amélioration de prestige achetée !");
        } else {
            showNotification("Pas assez de points de prestige !");
        }
    };

    const handleConfirmHardReset = () => {
        playSfx('click');
        resetGame(true);
        setActivePopup(null);
        setShowHardResetConfirm(false);
        showNotification("Jeu réinitialisé.");
    }
    
    const startNewGame = () => {
        resetGame(true);
        setSettings(s => ({...s, theme: s.theme}));
        setShowTutorial(true);
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
            setShowNewGameConfirm(true);
        } else {
            startNewGame();
        }
    };

    const handleConfirmNewGame = () => {
        playSfx('click');
        setShowNewGameConfirm(false);
        startNewGame();
        showNotification("Nouvelle partie commencée.");
    };

    if (appState === 'loading') {
        return <LoadingScreen />;
    }

    if (appState === 'menu') {
        return (
            <>
                <MainMenu
                    hasSaveData={hasSaveData}
                    onContinue={handleContinue}
                    onNewGame={handleNewGameClick}
                    playSfx={playSfx}
                />
                <ConfirmationPopup
                    show={showNewGameConfirm}
                    title="Commencer une nouvelle partie ?"
                    message="Votre progression actuelle sera effacée. Êtes-vous sûr de vouloir continuer ?"
                    onConfirm={handleConfirmNewGame}
                    onCancel={() => {
                        playSfx('click');
                        setShowNewGameConfirm(false);
                    }}
                />
            </>
        );
    }
    
    return (
        <GameUI
            // State
            energy={energy}
            upgrades={upgrades}
            achievements={achievements}
            canPrestige={canPrestige}
            prestigeGain={prestigeGain}
            totalUpgradesOwned={totalUpgradesOwned}
            settings={settings}
            particles={particles}
            floatingTexts={floatingTexts}
            notification={notification}
            activePopup={activePopup}
            showTutorial={showTutorial}
            showHardResetConfirm={showHardResetConfirm}
            showPrestigeConfirm={showPrestigeConfirm}
            prestigeCount={prestigeCount}
            purchasedPrestigeUpgrades={purchasedPrestigeUpgrades}
            // Formatters
            formattedEnergy={formattedEnergy}
            memoizedFormatNumber={memoizedFormatNumber}
            // Handlers
            onCollect={handleCollect}
            onBuyUpgrade={handleBuyUpgrade}
            onPrestige={handlePrestigeAttempt}
            onConfirmPrestige={confirmPrestige}
            onBuyPrestigeUpgrade={handleBuyPrestigeUpgrade}
            onConfirmHardReset={handleConfirmHardReset}
            onSettingsChange={handleSettingsChange}
            // Setters & Functions
            removeParticle={removeParticle}
            removeFloatingText={removeFloatingText}
            setActivePopup={setActivePopup}
            setShowTutorial={setShowTutorial}
            setShowHardResetConfirm={setShowHardResetConfirm}
            setShowPrestigeConfirm={setShowPrestigeConfirm}
            playSfx={playSfx}
        />
    );
};

export default App;