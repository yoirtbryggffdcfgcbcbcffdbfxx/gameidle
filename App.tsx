import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Upgrade, Achievement, Settings, Particle } from './types';
import { MAX_ENERGY, CLICK_POWER, INITIAL_UPGRADES, INITIAL_ACHIEVEMENTS, SAVE_KEY } from './constants';
import FlowingParticle from './components/FlowingParticle';

const calculateCost = (baseCost: number, owned: number) => Math.floor(baseCost * Math.pow(1.2, owned));

const App: React.FC = () => {
    const [energy, setEnergy] = useState(0);
    const [upgrades, setUpgrades] = useState<Upgrade[]>(() => 
        INITIAL_UPGRADES.map(u => ({ ...u, currentCost: calculateCost(u.baseCost, u.owned) }))
    );
    const [prestigeCount, setPrestigeCount] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
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
    
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdCounter = useRef(0);
    
    const sfx = useMemo(() => ({
        click: new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+Array(1e3).join("121213131414151516161717181819191a1a1b1b1c1c1d1d1e1e1f1f1g1g1h1h1i1i1j1j1k1k1l1l1m1m1n1n1o1o1p1p1q1q1r1r1s1s1t1t1u1u1v1v1w1w1x1x1y1y1z1z1{1{1|1|1}1}1~1~1 1 1 1 1¡1¡1¢1¢1£1£1¤1¤1¥1¥1¦1¦1§1§1¨1¨1©1©1ª1ª1«1«1¬1¬1­1­1®1®1¯1¯1°1°1±1±1²1²1³1³1´1´1µ1µ1¶1¶1·1·1¸1¸1¹1¹1º1º1»1»1¼1¼1½1½1¾1¾1¿1¿1À1À1Á1Á1Â1Â1Ã1Ã1Ä1Ä1Å1Å1Æ1Æ1Ç1Ç1È1È1É1É1Ê1Ê1Ë1Ë1Ì1Ì1Í1Í1Î1Î1Ï1Ï1Ð1Ð1Ñ1Ñ1Ò1Ò1Ó1Ó1Ô1Ô1Õ1Õ1Ö1Ö1×1×1Ø1Ø1Ù1Ù1Ú1Ú1Û1Û1Ü1Ü1Ý1Ý1Þ1Þ1ß1ß1à1à1á1á1â1â1ã1ã1ä1ä1å1å1æ1æ1ç1ç1è1è1é1é1ê1ê1ë1ë1ì1ì1í1í1î1î1ï1ï1ð1ð1ñ1ñ1ò1ò1ó1ó1ô1ô1õ1õ1ö1ö1÷1÷1ø1ø1ù1ù1ú1ú1û1û1ü1ü1ý1ý1þ1þ1ÿ1ÿ")),
        buy: new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+Array(1e3).join("ÿ þ ý ü û ú ù ø ÷ ö õ ô ó ò ñ ð ï î í ì ë ê é è ç æ å ä ã â á à ß Þ Ý Ü Û Ú Ù Ø × Ö Õ Ô Ó Ò Ñ Ð Ï Î Í Ì Ë Ê É È Ç Æ Å Ä Ã Â Á À ¿ ¾ ½ ¼ » º ¹ ¸ · ¶ µ ´ ³ ² ± ° ¯ ® ­ ¬ « ª © ¨ § ¦ ¥ ¤ £ ¢ ¡     ~ } | { z y x w v u t s r q p o n m l k j i h g f e d c b a ` _ ^ ]  [ Z Y X W V U T S R Q P O N M L K J I H G F E D C B A @ ? > = < ; : 9 8 7 6 5 4 3 2 1 0 / . - , + * ) ( ' & % $ # \" !  ")),
    }), []);
    
    const playSfx = useCallback((sound: 'click' | 'buy') => {
        if (settings.sfxVolume > 0) {
            const audio = sfx[sound];
            audio.currentTime = 0;
            audio.volume = settings.sfxVolume;
            audio.play().catch(e => console.error("SFX play failed:", e));
        }
    }, [settings.sfxVolume, sfx]);

    const formatNumber = useCallback((num: number) => {
        if (settings.scientificNotation && num >= 10000) {
            return num.toExponential(2);
        }
        return Math.floor(num).toLocaleString('fr-FR');
    }, [settings.scientificNotation]);

    const productionTotal = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.production * u.owned, 0);
    }, [upgrades]);

    const totalUpgradesOwned = useMemo(() => {
        return upgrades.reduce((total, u) => total + u.owned, 0);
    }, [upgrades]);
    
    useEffect(() => {
        const gameTick = setInterval(() => {
            setEnergy(prev => Math.min(prev + productionTotal, MAX_ENERGY));
        }, 1000);
        return () => clearInterval(gameTick);
    }, [productionTotal]);
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    useEffect(() => {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);
            if (savedGame) {
                const data = JSON.parse(savedGame);
                setEnergy(data.energy || 0);
                setPrestigeCount(data.prestigeCount || 0);
                
                if (data.settings) {
                    setSettings(s => ({...s, ...data.settings}));
                }

                const loadedUpgrades = INITIAL_UPGRADES.map((u, i) => {
                    const savedUpgrade = data.upgrades && data.upgrades[i];
                    const owned = savedUpgrade ? savedUpgrade.owned : 0;
                    return { ...u, owned, currentCost: calculateCost(u.baseCost, owned) };
                });
                setUpgrades(loadedUpgrades);
                
                const loadedAchievements = INITIAL_ACHIEVEMENTS.map((a, i) => {
                     const savedAchievement = data.achievements && data.achievements[i];
                     return savedAchievement ? { ...a, unlocked: savedAchievement.unlocked } : a;
                });
                setAchievements(loadedAchievements);

            } else {
                setShowTutorial(true);
            }
        } catch (error) {
            console.error("Failed to load game state:", error);
            setShowTutorial(true);
        }
    }, []);

    useEffect(() => {
        const saveGame = setInterval(() => {
            const gameState = { 
                energy, 
                upgrades: upgrades.map(({name, owned}) => ({name, owned})), 
                prestigeCount, 
                achievements,
                settings,
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        }, 5000);
        return () => clearInterval(saveGame);
    }, [energy, upgrades, prestigeCount, achievements, settings]);

    const showNotification = (text: string) => {
        setMessage({ text, show: true });
        setTimeout(() => setMessage({ text: '', show: false }), 1200);
    };

    const addParticle = (x: number, y: number, color: string) => {
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
    };
    
    const removeParticle = (id: number) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    const handleCollect = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSfx('click');
        const newEnergy = Math.min(energy + CLICK_POWER + prestigeCount, MAX_ENERGY);
        setEnergy(newEnergy);
        addParticle(e.clientX, e.clientY, '#00ffcc');
        unlockAchievement("Premier Clic");
    };

    const handleBuyUpgrade = (index: number) => {
        const upgrade = upgrades[index];
        if (energy >= upgrade.currentCost) {
            playSfx('buy');
            setEnergy(energy - upgrade.currentCost);
            const newUpgrades = [...upgrades];
            newUpgrades[index].owned++;
            newUpgrades[index].currentCost = calculateCost(upgrade.baseCost, newUpgrades[index].owned);
            setUpgrades(newUpgrades);
            addParticle(window.innerWidth / 2, window.innerHeight / 2, '#ffff00');
            unlockAchievement("Premier Achat");
        } else {
            showNotification("Pas assez d'énergie !");
        }
    };

    const unlockAchievement = useCallback((name: string) => {
        setAchievements(prev => {
            const newAchievements = [...prev];
            const achievement = newAchievements.find(a => a.name === name);
            if (achievement && !achievement.unlocked) {
                achievement.unlocked = true;
                showNotification(`Succès débloqué : ${name}`);
            }
            return newAchievements;
        });
    }, []);

    useEffect(() => {
        if (totalUpgradesOwned >= 10) {
            unlockAchievement("Collectionneur");
        }
    }, [totalUpgradesOwned, unlockAchievement]);

    const canPrestige = useMemo(() => energy >= MAX_ENERGY && totalUpgradesOwned >= 10, [energy, totalUpgradesOwned]);
    
    const handlePrestige = () => {
        if (canPrestige) {
            setPrestigeCount(prev => prev + 1);
            setEnergy(0);
            setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, currentCost: calculateCost(u.baseCost, u.owned) })));
            setActivePopup(null);
            showNotification(`Prestige x${prestigeCount + 1} obtenu !`);
            unlockAchievement("Première Prestige");
        }
    };

    const handleSoftReset = () => {
        setEnergy(0);
        setPrestigeCount(0);
        setUpgrades(INITIAL_UPGRADES.map(u => ({ ...u, currentCost: calculateCost(u.baseCost, u.owned) })));
        setAchievements(INITIAL_ACHIEVEMENTS);
    };

    const handleHardReset = () => {
        localStorage.removeItem(SAVE_KEY);
        handleSoftReset();
        setActivePopup(null);
        showNotification("Jeu réinitialisé.");
    }
    
    const energyPercentage = (energy / MAX_ENERGY) * 100;

    return (
        <div className="min-h-screen flex flex-col text-xs md:text-sm select-none">
            {particles.map(p => (
                <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />
            ))}

            <h1 className="text-lg md:text-2xl text-center my-2 text-[var(--text-header)] [text-shadow:1px_1px_#000]">Idle Game Optimisé</h1>

            {/* Top Bar */}
            <div className="flex justify-between items-center mx-2 md:mx-4 my-1">
                <div className="flex-1 mr-2 md:mr-4">
                    <div className="relative w-full h-5 bg-[#222] rounded-full overflow-hidden shadow-inner shadow-black">
                        <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${energyPercentage}%` }}></div>
                        <div className="absolute w-full h-full flex items-center justify-center text-[#00ffcc] [text-shadow:1px_1px_#000] font-bold">
                            Énergie : {formatNumber(energy)}
                        </div>
                    </div>
                </div>
                <button onClick={handleCollect} className="px-2 py-1.5 md:px-4 md:py-2 text-white bg-[#ff5555] rounded-md hover:shadow-lg hover:shadow-white/50 transition-shadow shrink-0">⚡ Collecter</button>
                <button onClick={handleSoftReset} className="ml-2 px-2 py-1.5 md:px-4 md:py-2 text-white bg-[#ff9900] rounded-md hover:shadow-lg hover:shadow-white/50 transition-shadow shrink-0">Reset</button>
            </div>
            
            {/* Upgrades Container */}
            <div className="flex-grow mx-2 md:mx-4 my-2 border-t border-[var(--border-color)] pt-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
                {upgrades.map((u, i) => (
                    <div key={i} className="bg-[var(--bg-upgrade)] p-2 my-1.5 rounded-lg w-[98%] mx-auto shadow-lg relative">
                        <div className="flex justify-between items-center">
                            <div>
                                <strong style={{ color: u.color, textShadow: '1px 1px 1px #000' }}>{u.name}</strong>
                                <span className="mx-2">|</span>
                                <span>Possédés: {u.owned}</span>
                                <span className="mx-2">|</span>
                                <span>Prod: {formatNumber(u.production * u.owned)}/sec</span>
                            </div>
                            <button onClick={() => handleBuyUpgrade(i)} style={{ background: u.color }} className="text-white px-2 py-1 rounded-md hover:shadow-md hover:shadow-white/50 transition-shadow">
                                Acheter ({formatNumber(u.currentCost)})
                            </button>
                        </div>
                        <div className="h-2.5 rounded-md bg-[#222] overflow-hidden mt-1.5">
                            <div className="h-full rounded-md bg-gradient-to-r from-[#00ccff] to-[#0044ff] transition-all duration-300" style={{ width: `${Math.min(u.owned * 2, 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Menu */}
            <div className="fixed bottom-0 left-0 w-full flex justify-around bg-black/50 py-2 backdrop-blur-sm">
                <button onClick={() => setActivePopup('prestige')} className="px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-500 transition-colors">✨ Prestige</button>
                <button onClick={() => setActivePopup('achievements')} className="px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-500 transition-colors">🏆 Succès</button>
                <button onClick={() => setActivePopup('settings')} className="px-3 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">⚙ Paramètres</button>
            </div>

            {/* Popups */}
            {activePopup && (
                 <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={() => setActivePopup(null)}>
                    <div className="bg-[var(--bg-popup)] p-4 rounded-lg w-80 max-w-[90%] shadow-2xl max-h-[80vh] overflow-y-auto text-[var(--text-main)]" onClick={(e) => e.stopPropagation()}>
                        {activePopup === 'prestige' && (
                            <>
                                <h3 className="mt-0 text-[var(--text-header)] text-lg mb-4">Prestige</h3>
                                {!canPrestige ? (
                                    <div>
                                        <p>Conditions non remplies :</p>
                                        <ul className="list-disc list-inside">
                                            <li className={energy >= MAX_ENERGY ? 'text-green-400' : 'text-red-400'}>Énergie ≥ {formatNumber(MAX_ENERGY)}</li>
                                            <li className={totalUpgradesOwned >= 10 ? 'text-green-400' : 'text-red-400'}>Total Upgrades ≥ 10</li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Conditions remplies !</p>
                                        <p className="my-2 text-sm opacity-80">Réinitialise votre progression (sauf les points de prestige) pour un bonus permanent de production.</p>
                                        <button onClick={handlePrestige} className="w-full bg-green-600 text-white p-2 rounded mt-2">Faire Prestige</button>
                                    </div>
                                )}
                            </>
                        )}
                        {activePopup === 'achievements' && (
                             <>
                                <h3 className="mt-0 text-[var(--text-header)] text-lg mb-4">Succès</h3>
                                {achievements.map((a, i) => (
                                    <div key={i} className={`p-2 my-1 rounded ${a.unlocked ? 'bg-green-800/50' : 'bg-gray-700/50'}`}>
                                      <span>{a.unlocked ? '✅' : '❌'}</span> {a.name}
                                      <p className="text-xs opacity-70 pl-6">{a.description}</p>
                                    </div>
                                ))}
                            </>
                        )}
                         {activePopup === 'settings' && (
                             <>
                                <h3 className="mt-0 text-[var(--text-header)] text-lg mb-4">Paramètres</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between">
                                        <span>Effets visuels</span>
                                        <input type="checkbox" className="toggle" checked={settings.visualEffects} onChange={(e) => setSettings(s => ({...s, visualEffects: e.target.checked}))} />
                                    </label>
                                     <label className="flex items-center justify-between">
                                        <span>Notation scientifique</span>
                                        <input type="checkbox" checked={settings.scientificNotation} onChange={(e) => setSettings(s => ({...s, scientificNotation: e.target.checked}))} />
                                    </label>
                                    <label className="flex flex-col">
                                        <span>Vitesse animation : {settings.animSpeed}x</span>
                                        <input type="range" min="1" max="5" step="0.5" value={settings.animSpeed} onChange={(e) => setSettings(s => ({...s, animSpeed: parseFloat(e.target.value)}))} />
                                    </label>
                                     <label className="flex flex-col">
                                        <span>Volume SFX : {Math.round(settings.sfxVolume * 100)}%</span>
                                        <input type="range" min="0" max="1" step="0.01" value={settings.sfxVolume} onChange={(e) => setSettings(s => ({...s, sfxVolume: parseFloat(e.target.value)}))} />
                                    </label>
                                    <label className="flex items-center justify-between">
                                        <span>Thème</span>
                                         <select value={settings.theme} onChange={(e) => setSettings(s => ({...s, theme: e.target.value as 'dark' | 'light'}))} className="bg-gray-700 text-white p-1 rounded">
                                            <option value="dark">Néon Noir</option>
                                            <option value="light">Classique Clair</option>
                                        </select>
                                    </label>
                                    <button onClick={handleHardReset} className="w-full bg-red-700 text-white p-2 rounded mt-4">Réinitialiser le jeu</button>
                                </div>
                            </>
                        )}
                    </div>
                 </div>
            )}
            
            {/* Tutorial Popup */}
            {showTutorial && (
                 <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[var(--bg-popup)] text-[var(--text-main)] p-3 rounded-lg w-64 text-center shadow-2xl z-40">
                    <p>⚡ Clique = énergie</p>
                    <p className="my-1">↑ Upgrades = production</p>
                    <p>✨ Prestige = bonus permanent</p>
                    <button onClick={() => setShowTutorial(false)} className="bg-blue-600 text-white mt-2 px-4 py-1 rounded">J'ai compris</button>
                </div>
            )}

            {/* Notification Message */}
            {message.show && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#ff4444] px-4 py-2 rounded-md font-bold z-50 [text-shadow:1px_1px_#000] animate-pop">
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default App;