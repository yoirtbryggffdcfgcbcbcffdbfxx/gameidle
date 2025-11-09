import React, { useState, useEffect, useRef } from 'react';

// Types
import { Settings, Upgrade, Achievement, Particle, FloatingText as FloatingTextType, CoreUpgrade } from '../types';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import UpgradeList from './UpgradeList';
import SettingsPopup from './popups/SettingsPopup';
import AchievementsPopup from './popups/AchievementsPopup';
import ConfirmationPopup from './popups/ConfirmationPopup';
import DevPanel from './popups/DevPanel';
import AscensionTutorialPopup from './popups/AscensionTutorialPopup';
import CoreTutorialPopup from './popups/CoreTutorialPopup';
import Logo from './Logo';
import ScrollspyNav from './ScrollspyNav';
import AscensionSection from './AscensionSection';
import ReactorSection from './ReactorSection';
import TutorialTooltip from './TutorialTooltip';


interface GameUIProps {
    // State & Data
    energy: number;
    upgrades: Upgrade[];
    visibleUpgrades: { upgradeData: Upgrade; originalIndex: number; }[];
    achievements: Achievement[];
    ascensionLevel: number;
    ascensionPoints: number;
    productionTotal: number;
    clickPower: number;
    purchasedAscensionUpgrades: string[];
    ascensionBonuses: { productionMultiplier: number; clickMultiplier: number; costReduction: number; startingEnergy: number; };
    achievementBonuses: { production: number; click: number; coreCharge: number; costReduction: number; };
    coreBonuses: { chargeRate: number; multiplier: number; };
    canAscend: boolean;
    ascensionGain: number;
    unlockedUpgradesForCurrentAscensionCount: number;
    unlockedUpgradesAtMaxLevelCount: number;
    maxEnergy: number;
    settings: Settings;
    particles: Particle[];
    floatingTexts: FloatingTextType[];
    tutorialStep: number;
    showHardResetConfirm: boolean;
    showAscensionConfirm: boolean;
    showAscensionTutorial: boolean;
    showDevPanel: boolean;
    coreCharge: number;
    isCoreDischarging: boolean;
    quantumShards: number;
    purchasedCoreUpgrades: string[];
    showCoreTutorial: boolean;

    // Callbacks & Handlers
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onBuyUpgrade: (index: number) => void;
    unlockSpecificUpgrade: (id: string) => void;
    onAscend: () => void;
    onConfirmAscension: () => void;
    onBuyAscensionUpgrade: (id: string) => void;
    onBuyCoreUpgrade: (id: string) => void;
    onConfirmHardReset: () => void;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onDischargeCore: () => void;
    dev: {
        addEnergy: () => void;
        addAscension: () => void;
        unlockAllUpgrades: () => void;
        unlockAllAchievements: () => void;
        resetAchievements: () => void;
        closePanel: () => void;
    };
    
    // Functions
    playSfx: (sound: any) => void;
    formatNumber: (num: number) => string;
    addFloatingText: (text: string, x: number, y: number, color: string) => void;
    removeParticle: (id: number) => void;
    removeFloatingText: (id: number) => void;
    setTutorialStep: (step: number) => void;
    setShowHardResetConfirm: (show: boolean) => void;
    setShowAscensionConfirm: (show: boolean) => void;
    setShowAscensionTutorial: (show: boolean) => void;
    setShowCoreTutorial: (show: boolean) => void;
}

const StatDisplay: React.FC<{ label: string; value: string; icon: string; colorClass: string; }> = ({ label, value, icon, colorClass }) => (
    <div className={`bg-black/30 p-2 rounded-lg text-center flex-1 ${colorClass}`}>
        <div className="text-xs opacity-80">{icon} {label}</div>
        <div className="text-base md:text-lg font-bold truncate">{value}</div>
    </div>
);

const SectionHeader: React.FC<{ title: string; energy: number; formatNumber: (n: number) => string; }> = ({ title, energy, formatNumber }) => (
    <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-2xl text-center text-[var(--text-header)]">{title}</h2>
        <div className="bg-black/30 px-3 py-1 rounded-lg text-xs">
            <span className="text-cyan-300">⚡ {formatNumber(energy)}</span>
        </div>
    </div>
);


const GameUI: React.FC<GameUIProps> = (props) => {
    const {
        upgrades, achievements, ascensionLevel, canAscend, maxEnergy, productionTotal,
        settings, particles, floatingTexts, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial,
        onBuyUpgrade, unlockSpecificUpgrade, onSettingsChange,
        playSfx, formatNumber, addFloatingText, removeParticle, removeFloatingText, setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial,
        showDevPanel, dev, showCoreTutorial, setShowCoreTutorial
    } = props;

    const [activeSection, setActiveSection] = useState('core');
    const [activeCommandCenterTab, setActiveCommandCenterTab] = useState('achievements');
    const [showAscensionSection, setShowAscensionSection] = useState(false);
    const gameContentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (canAscend || ascensionLevel > 0) {
            setShowAscensionSection(true);
        }
    }, [canAscend, ascensionLevel]);

    const showReactorSection = ascensionLevel > 0;

    const sections = [
        { id: 'core', name: 'Cœur' },
        { id: 'forge', name: 'Forge' },
        { id: 'command-center', name: 'Commandement' },
        ...(showAscensionSection ? [{ id: 'ascension-portal', name: 'Ascension' }] : []),
        ...(showReactorSection ? [{ id: 'reactor', name: 'Réacteur' }] : []),
    ];

    // On-Reveal & Scrollspy Effect
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const mostVisibleEntry = entries.reduce((prev, current) => 
                (prev.intersectionRatio > current.intersectionRatio) ? prev : current
            );

            if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
                setActiveSection(mostVisibleEntry.target.id);
            }

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: Array.from(Array(21).keys()).map(i => i / 20) });

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => {
             sections.forEach(section => {
                const el = document.getElementById(section.id);
                if (el) observer.unobserve(el);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAscensionSection, showReactorSection]); 
    
    // Contextual Floating Text for passive production
    useEffect(() => {
        if (activeSection !== 'core' || productionTotal <= 0) return;

        const interval = setInterval(() => {
            if (productionTotal > 0) {
                 addFloatingText(`+${formatNumber(productionTotal)}`, window.innerWidth / 3, window.innerHeight / 2, '#00ffcc');
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [activeSection, productionTotal, addFloatingText, formatNumber]);
    
    // Drag-to-scroll for mobile-like experience
    useEffect(() => {
        const el = gameContentRef.current;
        if (!el) return;

        let isDown = false;
        let startY: number;
        let scrollTop: number;

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            isDown = true;
            el.classList.add('active');
            const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
            startY = pageY - el.offsetTop;
            scrollTop = el.scrollTop;
        };
        
        const handleMouseLeave = () => {
            isDown = false;
            el.classList.remove('active');
        };

        const handleMouseUp = () => {
            isDown = false;
            el.classList.remove('active');
        };

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const pageY = 'touches' in e ? e.touches[0].pageY : e.pageY;
            const y = pageY - el.offsetTop;
            const walk = (y - startY) * 2; // scroll-fast
            el.scrollTop = scrollTop - walk;
        };
        
        el.addEventListener('mousedown', handleMouseDown);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseup', handleMouseUp);
        el.addEventListener('mousemove', handleMouseMove);
        
        el.addEventListener('touchstart', handleMouseDown);
        el.addEventListener('touchend', handleMouseUp);
        el.addEventListener('touchmove', handleMouseMove);

        return () => {
            el.removeEventListener('mousedown', handleMouseDown);
            el.removeEventListener('mouseleave', handleMouseLeave);
            el.removeEventListener('mouseup', handleMouseUp);
            el.removeEventListener('mousemove', handleMouseMove);
            
            el.removeEventListener('touchstart', handleMouseDown);
            el.removeEventListener('touchend', handleMouseUp);
            el.removeEventListener('touchmove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const firstUpgradeCost = upgrades.find(u => u.id === 'gen_1')?.baseCost || 10;
        if (tutorialStep === 2 && props.energy >= firstUpgradeCost) {
            unlockSpecificUpgrade('gen_1');
            setTutorialStep(3); 
        }
        if (tutorialStep === 3 && activeSection === 'forge') {
            setTutorialStep(4);
        }
        if (tutorialStep === 5 && activeSection === 'command-center') {
            setTutorialStep(6);
        }
    }, [props.energy, tutorialStep, setTutorialStep, unlockSpecificUpgrade, upgrades, activeSection]);


    return (
        <div ref={gameContentRef} id="game-content" className="min-h-full text-xs md:text-sm select-none">
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            <ScrollspyNav sections={sections} activeSection={activeSection} />

            <main>
                {/* Section 1: Core */}
                <section id="core" className="fullscreen-section reveal">
                    <div className="text-center flex flex-col items-center justify-between h-full py-8 w-full max-w-lg">
                        <Logo />
                        <div className="w-full space-y-3">
                            <div id="energy-bar-container" className="relative w-full h-8 bg-black/50 rounded-full overflow-hidden shadow-inner border-2 border-cyan-800/50">
                                <div id="energyBar" className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00ffcc] to-[#0044ff] rounded-full transition-all duration-200" style={{ width: `${(props.energy / maxEnergy) * 100}%` }}></div>
                                <div className="absolute w-full h-full flex items-center justify-center text-sm [text-shadow:1px_1px_#000] font-bold">
                                    Énergie
                                </div>
                            </div>
                            <div className="text-center text-xs opacity-70">{formatNumber(props.energy)} / {formatNumber(maxEnergy)}</div>
                            <div className="flex justify-around items-center gap-2">
                                <StatDisplay label="Prod/sec" value={formatNumber(props.productionTotal)} icon="⚡" colorClass="text-yellow-300" />
                                <StatDisplay label="Clic" value={formatNumber(props.clickPower)} icon="🖱️" colorClass="text-cyan-300" />
                            </div>
                        </div>

                        <button 
                            id="collect-button"
                            onClick={props.onCollect} 
                            className={`w-48 h-16 text-xl rounded-md bg-red-600 hover:bg-red-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 flex justify-center items-center mx-auto`}
                        >
                            Collecter
                        </button>
                    </div>
                </section>

                {/* Section 2: Forge */}
                <section id="forge" className="fullscreen-section reveal">
                    <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                        <SectionHeader title="La Forge" energy={props.energy} formatNumber={formatNumber} />
                        <div id="upgrades-hub" className="flex-grow overflow-hidden">
                            <UpgradeList 
                                upgrades={props.visibleUpgrades}
                                onBuyUpgrade={onBuyUpgrade}
                                formatNumber={formatNumber}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Command Center */}
                <section id="command-center" className="fullscreen-section reveal">
                    <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                         <SectionHeader title="Centre de Commandement" energy={props.energy} formatNumber={formatNumber} />
                        <div className="flex justify-center border-b border-[var(--border-color)] mb-4">
                            {['achievements', 'settings'].map(tab => (
                                <button
                                    key={tab}
                                    id={`tab-${tab}`}
                                    onClick={() => setActiveCommandCenterTab(tab)}
                                    className={`px-4 py-2 text-sm md:text-base transition-all duration-300 relative ${activeCommandCenterTab === tab ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                                >
                                    {tab === 'achievements' ? 'Succès' : 'Paramètres'}
                                    {activeCommandCenterTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-header)]"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="flex-grow overflow-hidden relative">
                             <div className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'achievements' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <AchievementsPopup achievements={props.achievements} achievementBonuses={props.achievementBonuses} onClose={() => {}} />
                            </div>
                             <div className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'settings' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => {}} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Ascension (Conditional) */}
                {showAscensionSection && (
                    <AscensionSection {...props} />
                )}

                {/* Section 5: Reactor (Conditional) */}
                {showReactorSection && (
                     <ReactorSection {...props} />
                )}
            </main>
            
            {/* Global Popups & Overlays */}
            <TutorialTooltip step={tutorialStep} setStep={setTutorialStep} />
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}
            {showDevPanel && <DevPanel {...dev} />}
            <ConfirmationPopup show={showHardResetConfirm} title="Confirmer la réinitialisation" message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible." onConfirm={props.onConfirmHardReset} onCancel={() => { playSfx('click'); setShowHardResetConfirm(false); }} />
            <ConfirmationPopup show={showAscensionConfirm} title="Confirmer l'Ascension" message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${props.ascensionGain} point d'ascension et ${props.ascensionGain} Fragment Quantique. Continuer ?`} onConfirm={props.onConfirmAscension} onCancel={() => { playSfx('click'); setShowAscensionConfirm(false); }} />
        </div>
    );
};

export default GameUI;