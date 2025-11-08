import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Settings, Particle } from './types';
import { CLICK_POWER, PARTICLE_COLORS } from './constants';
import { useGameState } from './hooks/useGameState';
import { formatNumber } from './utils/helpers';
import { sfx } from './sfx';

// Component Imports
import FlowingParticle from './components/FlowingParticle';
import Header from './components/Header';
import UpgradeList from './components/UpgradeList';
import Footer from './components/Footer';
import SettingsPopup from './components/popups/SettingsPopup';
import AchievementsPopup from './components/popups/AchievementsPopup';
import PrestigePopup from './components/popups/PrestigePopup';
import TutorialPopup from './components/TutorialPopup';
import Notification from './components/Notification';
import ConfirmationPopup from './components/popups/ConfirmationPopup';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';

type AppState = 'loading' | 'menu' | 'game';

const App: React.FC = () => {
    const {
        energy, setEnergy,
        upgrades,
        prestigeCount,
        achievements,
        totalUpgradesOwned,
        canPrestige,
        isLoaded,
        hasSaveData,
        saveGameState,
        buyUpgrade,
        doPrestige,
        resetGame,
        unlockAchievement,
    } = useGameState();
    
    const [appState, setAppState] = useState<AppState>('loading');
    
    const [settings, setSettings] = useState<Settings>({ 
        visualEffects: true, 
        animSpeed: 2,
        scientificNotation: false,
        theme: 'dark',
        sfxVolume: 0.5,
    });

    const [message, setMessage] = useState<{ text: string; show: boolean }>({ text: '', show: false });
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showHardResetConfirm, setShowHardResetConfirm] = useState(false);
    const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
    
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdCounter = useRef(0);
    
    const playSfx = useCallback((sound: 'click' | 'buy' | 'ui_hover') => {
        if (settings.sfxVolume > 0) {
            const audio = sfx[sound];
            audio.currentTime = 0;
            audio.volume = settings.sfxVolume;
            audio.play().catch(e => console.error("SFX play failed:", e));
        }
    }, [settings.sfxVolume]);

    const formattedEnergy = useMemo(() => formatNumber(energy, settings.scientificNotation), [energy, settings.scientificNotation]);
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    useEffect(() => {
        if(isLoaded) {
            const savedGame = localStorage.getItem('reactIdleGameSave');
            if(savedGame) {
                const data = JSON.parse(savedGame);
                if (data.settings) {
                    setSettings(s => ({...s, ...data.settings}));
                }
            } else {
                 if (appState === 'game') setShowTutorial(true);
            }
        }
    }, [isLoaded, appState]);

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setAppState('menu');
            }, 1000); // Artificial delay for better UX
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    useEffect(() => {
        if (!isLoaded || appState !== 'game') return;
        const saveTimer = setInterval(() => saveGameState(settings), 5000);
        return () => clearInterval(saveTimer);
    }, [saveGameState, settings, isLoaded, appState]);

    const showNotification = useCallback((text: string) => {
        setMessage({ text, show: true });
        setTimeout(() => setMessage({ text: '', show: false }), 1200);
    }, []);

    const addParticle = useCallback((x: number, y: number, color: string) => {
        if (!settings.visualEffects) return;
        for (let i = 0; i < 10; i++) {
            const newParticle: Particle = {
                id: particleIdCounter.current++,
                startX: x,
                startY: y,
                color,
            };
            setParticles(prev => [...prev, newParticle]);
        }
    }, [settings.visualEffects]);
    
    const removeParticle = (id: number) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        setEnergy(prev => Math.min(prev + CLICK_POWER + prestigeCount, 10000));
        addParticle(e.clientX, e.clientY, PARTICLE_COLORS.CLICK);
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
        if (appState === 'game' && totalUpgradesOwned >= 10) {
            if (unlockAchievement("Collectionneur")) {
                showNotification("Succès débloqué : Collectionneur");
            }
        }
    }, [totalUpgradesOwned, unlockAchievement, showNotification, appState]);
    
    const handlePrestige = () => {
        if (doPrestige()) {
            setActivePopup(null);
            showNotification(`Prestige x${prestigeCount + 1} obtenu !`);
            if (unlockAchievement("Première Prestige")) {
                showNotification("Succès débloqué : Première Prestige");
            }
        }
    };

    const handleOpenHardResetConfirm = () => {
        setShowHardResetConfirm(true);
    };
    
    const handleConfirmHardReset = () => {
        resetGame(true);
        setActivePopup(null);
        setShowHardResetConfirm(false);
        showNotification("Jeu réinitialisé.");
    }
    
    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => {
        setSettings(s => ({...s, ...newSettings}));
    }, []);

    const memoizedFormatNumber = useCallback((num: number) => formatNumber(num, settings.scientificNotation), [settings.scientificNotation]);

    // Menu Handlers
    const startNewGame = () => {
        resetGame(true);
        setShowTutorial(true);
        setAppState('game');
    };

    const handleNewGameClick = () => {
        if (hasSaveData) {
            setShowNewGameConfirm(true);
        } else {
            startNewGame();
        }
    };

    const handleConfirmNewGame = () => {
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
                    onContinue={() => setAppState('game')}
                    onNewGame={handleNewGameClick}
                    playSfx={playSfx}
                />
                <ConfirmationPopup
                    show={showNewGameConfirm}
                    title="Commencer une nouvelle partie ?"
                    message="Votre progression actuelle sera effacée. Êtes-vous sûr de vouloir continuer ?"
                    onConfirm={handleConfirmNewGame}
                    onCancel={() => setShowNewGameConfirm(false)}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen flex flex-col text-xs md:text-sm select-none">
            {particles.map(p => (
                <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />
            ))}

            <Header 
                energy={energy}
                formattedEnergy={formattedEnergy}
                onCollect={handleCollect}
            />
            
            <UpgradeList 
                upgrades={upgrades}
                onBuyUpgrade={handleBuyUpgrade}
                formatNumber={memoizedFormatNumber}
            />

            <Footer onMenuClick={(popup) => setActivePopup(popup)} />

            {/* Popups */}
            {activePopup === 'prestige' && (
                <PrestigePopup
                    canPrestige={canPrestige}
                    energy={energy}
                    totalUpgradesOwned={totalUpgradesOwned}
                    onPrestige={handlePrestige}
                    onClose={() => setActivePopup(null)}
                    formatNumber={memoizedFormatNumber}
                />
            )}
            {activePopup === 'achievements' && (
                <AchievementsPopup achievements={achievements} onClose={() => setActivePopup(null)} />
            )}
            {activePopup === 'settings' && (
                <SettingsPopup 
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    onClose={() => setActivePopup(null)}
                    onHardReset={handleOpenHardResetConfirm}
                />
            )}
            
            <TutorialPopup show={showTutorial} onClose={() => setShowTutorial(false)} />
            
            <Notification message={message.text} show={message.show} />

            <ConfirmationPopup
                show={showHardResetConfirm}
                title="Confirmer la réinitialisation"
                message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible."
                onConfirm={handleConfirmHardReset}
                onCancel={() => setShowHardResetConfirm(false)}
            />
        </div>
    );
};

export default App;