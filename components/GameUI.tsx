import React, { useState, useEffect } from 'react';

// Types
import { Settings, Upgrade, Achievement, Particle, FloatingText as FloatingTextType, CoreUpgrade } from '../types';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import UpgradeList from './UpgradeList';
import SettingsPopup from './popups/SettingsPopup';
import AchievementsPopup from './popups/AchievementsPopup';
import AscensionPopup from './popups/PrestigePopup';
import TutorialOverlay from './TutorialPopup';
import ConfirmationPopup from './popups/ConfirmationPopup';
import DevPanel from './popups/DevPanel';
import AscensionTutorialPopup from './popups/AscensionTutorialPopup';
import CoreUpgradesPopup from './popups/CoreUpgradesPopup';
import CoreTutorialPopup from './popups/CoreTutorialPopup';
import NavBar from './NavBar';
import ControlPanel from './ControlPanel';
import MobileNav from './MobileNav';
import MobileMenuPopup from './popups/MobileMenuPopup';


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
    ascensionBonuses: {
        productionMultiplier: number;
        clickMultiplier: number;
        costReduction: number;
        startingEnergy: number;
    };
    achievementBonuses: {
        production: number;
        click: number;
        coreCharge: number;
        costReduction: number;
    };
    coreBonuses: {
        chargeRate: number;
        multiplier: number;
    };
    canAscend: boolean;
    ascensionGain: number;
    totalUpgradesOwned: number;
    unlockedUpgradesForCurrentAscensionCount: number;
    unlockedUpgradesAtMaxLevelCount: number;
    maxEnergy: number;
    formattedEnergy: string;
    settings: Settings;
    particles: Particle[];
    floatingTexts: FloatingTextType[];
    activePopup: string | null;
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
    handleStartGameAfterCinematic: () => void; // Added for cinematic completion
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
    removeParticle: (id: number) => void;
    removeFloatingText: (id: number) => void;
    setActivePopup: (popup: string | null) => void;
    setTutorialStep: (step: number) => void;
    setShowHardResetConfirm: (show: boolean) => void;
    setShowAscensionConfirm: (show: boolean) => void;
    setShowAscensionTutorial: (show: boolean) => void;
    setShowCoreTutorial: (show: boolean) => void;
}


const GameUI: React.FC<GameUIProps> = (props) => {
    const {
        energy, upgrades, achievements, ascensionLevel, ascensionPoints, purchasedAscensionUpgrades, visibleUpgrades, ascensionBonuses, achievementBonuses, coreBonuses,
        canAscend, ascensionGain, unlockedUpgradesForCurrentAscensionCount, unlockedUpgradesAtMaxLevelCount, maxEnergy, formattedEnergy,
        settings, particles, floatingTexts, activePopup, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial,
        coreCharge, isCoreDischarging, onDischargeCore, quantumShards, purchasedCoreUpgrades, productionTotal, clickPower,
        onCollect, onBuyUpgrade, unlockSpecificUpgrade, onAscend, onConfirmAscension, onBuyAscensionUpgrade, onBuyCoreUpgrade, onConfirmHardReset, onSettingsChange,
        playSfx, formatNumber, removeParticle, removeFloatingText, setActivePopup, setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial,
        showDevPanel, dev, showCoreTutorial, setShowCoreTutorial
    } = props;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [activeMobileTab, setActiveMobileTab] = useState<'core' | 'upgrades'>('core');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Tutorial progression logic, moved from useGameEngine to handle mobile state
    useEffect(() => {
        const firstUpgradeCost = upgrades.find(u => u.id === 'gen_1')?.baseCost || 10;
        // Check if tutorial is at step 2 and player has enough energy for the next step
        if (tutorialStep === 2 && energy >= firstUpgradeCost) {
            // Pre-unlock the first upgrade so it's visible for the next step
            unlockSpecificUpgrade('gen_1');
            // Branch the tutorial flow based on device type
            if (isMobile) {
                setTutorialStep(2.5); // Go to mobile-specific step
            } else {
                setTutorialStep(3); // Go directly to buying the upgrade on desktop
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energy, tutorialStep, isMobile, setTutorialStep, unlockSpecificUpgrade, upgrades]);

    // Mobile-specific tutorial progression from tab switch to upgrade view
    useEffect(() => {
        if (isMobile && tutorialStep === 2.5 && activeMobileTab === 'upgrades') {
            setTutorialStep(3);
        }
    }, [isMobile, tutorialStep, activeMobileTab, setTutorialStep]);


    const commonPopups = (
        <>
            {activePopup === 'ascension' && (
                <AscensionPopup 
                    canAscend={canAscend} 
                    ascensionPoints={ascensionPoints}
                    ascensionLevel={ascensionLevel}
                    ascensionGain={ascensionGain}
                    purchasedAscensionUpgrades={purchasedAscensionUpgrades}
                    onAscend={onAscend} 
                    onBuyAscensionUpgrade={onBuyAscensionUpgrade}
                    onClose={() => setActivePopup(null)} 
                    energy={energy}
                    maxEnergy={maxEnergy}
                    formatNumber={formatNumber}
                    unlockedUpgradesAtMaxLevelCount={unlockedUpgradesAtMaxLevelCount}
                    unlockedUpgradesForCurrentAscensionCount={unlockedUpgradesForCurrentAscensionCount}
                />
            )}
            {activePopup === 'core' && (
                <CoreUpgradesPopup
                    shards={quantumShards}
                    purchasedUpgrades={purchasedCoreUpgrades}
                    onBuyUpgrade={onBuyCoreUpgrade}
                    onClose={() => setActivePopup(null)}
                />
            )}
            {activePopup === 'achievements' && (
                <AchievementsPopup 
                    achievements={achievements} 
                    achievementBonuses={achievementBonuses}
                    onClose={() => setActivePopup(null)} 
                />
            )}
            {activePopup === 'settings' && (
                <SettingsPopup 
                    settings={settings} 
                    onSettingsChange={onSettingsChange} 
                    onClose={() => setActivePopup(null)} 
                    onHardReset={() => setShowHardResetConfirm(true)} 
                    playSfx={playSfx}
                />
            )}
            
            <TutorialOverlay step={tutorialStep} setStep={setTutorialStep} />
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}

            {showDevPanel && <DevPanel {...dev} />}
            
            <ConfirmationPopup
                show={showHardResetConfirm}
                title="Confirmer la réinitialisation"
                message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible."
                onConfirm={onConfirmHardReset}
                onCancel={() => {
                    playSfx('click');
                    setShowHardResetConfirm(false);
                }}
            />
            <ConfirmationPopup
                show={showAscensionConfirm}
                title="Confirmer l'Ascension"
                message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${ascensionGain} point d'ascension et ${ascensionGain} Fragment Quantique. Continuer ?`}
                onConfirm={onConfirmAscension}
                onCancel={() => {
                    playSfx('click');
                    setShowAscensionConfirm(false);
                }}
            />
        </>
    );

    const fxElements = (
        <>
            {particles.map(p => (
                <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />
            ))}
            {floatingTexts.map(ft => (
                <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />
            ))}
        </>
    );

    if (isMobile) {
        return (
            <div className="h-screen flex flex-col text-xs select-none bg-[var(--bg-from)]">
                {fxElements}
                <main className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                    {activeMobileTab === 'core' && (
                        <ControlPanel 
                            energy={energy}
                            maxEnergy={maxEnergy}
                            productionTotal={productionTotal}
                            clickPower={clickPower}
                            ascensionLevel={ascensionLevel}
                            quantumShards={quantumShards}
                            ascensionPoints={ascensionPoints}
                            formatNumber={formatNumber}
                            onCollect={onCollect}
                            coreCharge={coreCharge}
                            isDischarging={isCoreDischarging}
                            onDischargeCore={onDischargeCore}
                            coreMultiplier={coreBonuses.multiplier}
                            isTutorialHighlight={tutorialStep === 1 || tutorialStep === 2}
                        />
                    )}
                    {activeMobileTab === 'upgrades' && (
                         <UpgradeList 
                            upgrades={visibleUpgrades}
                            onBuyUpgrade={onBuyUpgrade}
                            formatNumber={formatNumber}
                        />
                    )}
                </main>
                <MobileNav 
                    activeTab={activeMobileTab}
                    setActiveTab={setActiveMobileTab}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    canAscend={canAscend}
                    ascensionLevel={ascensionLevel}
                />
                {isMobileMenuOpen && (
                    <MobileMenuPopup 
                        onClose={() => setIsMobileMenuOpen(false)} 
                        onMenuClick={(popup) => {
                            setActivePopup(popup);
                            setIsMobileMenuOpen(false);
                        }}
                        canAscend={canAscend}
                        ascensionLevel={ascensionLevel}
                    />
                )}
                {commonPopups}
            </div>
        )
    }

    return (
        <div className="h-screen flex text-xs md:text-sm select-none bg-[var(--bg-from)]">
            {fxElements}

            <NavBar onMenuClick={(popup) => setActivePopup(popup)} ascensionLevel={ascensionLevel} canAscend={canAscend} />

            <main className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 p-2 md:p-4 max-h-screen overflow-hidden">
                <div className="lg:h-full">
                    <ControlPanel 
                        energy={energy}
                        maxEnergy={maxEnergy}
                        productionTotal={productionTotal}
                        clickPower={clickPower}
                        ascensionLevel={ascensionLevel}
                        quantumShards={quantumShards}
                        ascensionPoints={ascensionPoints}
                        formatNumber={formatNumber}
                        onCollect={onCollect}
                        coreCharge={coreCharge}
                        isDischarging={isCoreDischarging}
                        onDischargeCore={onDischargeCore}
                        coreMultiplier={coreBonuses.multiplier}
                        isTutorialHighlight={tutorialStep === 1 || tutorialStep === 2}
                    />
                </div>
                <div className="flex-1 min-h-0 lg:h-full">
                    <UpgradeList 
                        upgrades={visibleUpgrades}
                        onBuyUpgrade={onBuyUpgrade}
                        formatNumber={formatNumber}
                    />
                </div>
            </main>
            
            {commonPopups}
        </div>
    );
};

export default GameUI;