import React from 'react';

// Types
import { Settings, Upgrade, Achievement, Particle, FloatingText as FloatingTextType, CoreUpgrade } from '../types';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import Header from './Header';
import UpgradeList from './UpgradeList';
import Footer from './Footer';
import SettingsPopup from './popups/SettingsPopup';
import AchievementsPopup from './popups/AchievementsPopup';
import AscensionPopup from './popups/PrestigePopup'; // Renamed import
import GuidedTutorial from './TutorialPopup';
import ConfirmationPopup from './popups/ConfirmationPopup';
import DevPanel from './popups/DevPanel';
import AscensionTutorialPopup from './popups/AscensionTutorialPopup';
import CoreUpgradesPopup from './popups/CoreUpgradesPopup';
import CoreTutorialPopup from './popups/CoreTutorialPopup';


interface GameUIProps {
    // State & Data
    energy: number;
    upgrades: Upgrade[];
    visibleUpgrades: { upgradeData: Upgrade; originalIndex: number; }[];
    achievements: Achievement[];
    ascensionCount: number;
    purchasedAscensionUpgrades: string[];
    ascensionBonuses: {
        productionMultiplier: number;
        clickMultiplier: number;
        costReduction: number;
        startingEnergy: number;
    };
    coreBonuses: {
        chargeRate: number;
        multiplier: number;
    };
    canAscend: boolean;
    ascensionGain: number;
    totalUpgradesOwned: number;
    availableUpgradesForCurrentAscension: Upgrade[];
    upgradesAtMaxLevelCount: number;
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
        energy, achievements, ascensionCount, purchasedAscensionUpgrades, visibleUpgrades, ascensionBonuses, coreBonuses,
        canAscend, ascensionGain, availableUpgradesForCurrentAscension, upgradesAtMaxLevelCount, maxEnergy, formattedEnergy,
        settings, particles, floatingTexts, activePopup, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial,
        coreCharge, isCoreDischarging, onDischargeCore, quantumShards, purchasedCoreUpgrades,
        onCollect, onBuyUpgrade, onAscend, onConfirmAscension, onBuyAscensionUpgrade, onBuyCoreUpgrade, onConfirmHardReset, onSettingsChange,
        playSfx, formatNumber, removeParticle, removeFloatingText, setActivePopup, setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial,
        showDevPanel, dev, showCoreTutorial, setShowCoreTutorial
    } = props;

    return (
        <div className="min-h-screen flex flex-col text-xs md:text-sm select-none">
            {particles.map(p => (
                <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />
            ))}
            {floatingTexts.map(ft => (
                <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />
            ))}

            <Header 
                energy={energy}
                maxEnergy={maxEnergy}
                formattedEnergy={formattedEnergy}
                onCollect={onCollect}
                coreCharge={coreCharge}
                isDischarging={isCoreDischarging}
                onDischargeCore={onDischargeCore}
                coreMultiplier={coreBonuses.multiplier}
                quantumShards={quantumShards}
            />
            
            <UpgradeList 
                upgrades={visibleUpgrades}
                onBuyUpgrade={onBuyUpgrade}
                formatNumber={formatNumber}
            />

            <Footer onMenuClick={(popup) => setActivePopup(popup)} ascensionCount={ascensionCount} />

            {activePopup === 'ascension' && (
                <AscensionPopup 
                    canAscend={canAscend} 
                    ascensionCount={ascensionCount}
                    ascensionGain={ascensionGain}
                    purchasedAscensionUpgrades={purchasedAscensionUpgrades}
                    onAscend={onAscend} 
                    onBuyAscensionUpgrade={onBuyAscensionUpgrade}
                    onClose={() => setActivePopup(null)} 
                    energy={energy}
                    maxEnergy={maxEnergy}
                    formatNumber={formatNumber}
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
                <AchievementsPopup achievements={achievements} onClose={() => setActivePopup(null)} />
            )}
            {activePopup === 'settings' && (
                <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => setActivePopup(null)} onHardReset={() => setShowHardResetConfirm(true)} />
            )}
            
            <GuidedTutorial step={tutorialStep} />
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
        </div>
    );
};

export default GameUI;