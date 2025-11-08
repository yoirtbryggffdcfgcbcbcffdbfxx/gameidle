import React from 'react';

// Types
import { Settings, Upgrade, Achievement, Particle, FloatingText as FloatingTextType } from '../types';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import Header from './Header';
import UpgradeList from './UpgradeList';
import Footer from './Footer';
import SettingsPopup from './popups/SettingsPopup';
import AchievementsPopup from './popups/AchievementsPopup';
import PrestigePopup from './popups/PrestigePopup';
import TutorialPopup from './TutorialPopup';
import ConfirmationPopup from './popups/ConfirmationPopup';

interface GameUIProps {
    // State
    energy: number;
    upgrades: Upgrade[];
    achievements: Achievement[];
    canPrestige: boolean;
    prestigeGain: number;
    totalUpgradesOwned: number;
    settings: Settings;
    particles: Particle[];
    floatingTexts: FloatingTextType[];
    activePopup: string | null;
    showTutorial: boolean;
    showHardResetConfirm: boolean;
    showPrestigeConfirm: boolean;
    prestigeCount: number;
    purchasedPrestigeUpgrades: string[];
    // Formatters
    formattedEnergy: string;
    memoizedFormatNumber: (num: number) => string;
    // Handlers
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onBuyUpgrade: (index: number) => void;
    onPrestige: () => void;
    onConfirmPrestige: () => void;
    onBuyPrestigeUpgrade: (id: string) => void;
    onConfirmHardReset: () => void;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    // Setters & Functions
    removeParticle: (id: number) => void;
    removeFloatingText: (id: number) => void;
    setActivePopup: (popup: string | null) => void;
    setShowTutorial: (show: boolean) => void;
    setShowHardResetConfirm: (show: boolean) => void;
    setShowPrestigeConfirm: (show: boolean) => void;
    playSfx: (sound: any) => void;
}

const GameUI: React.FC<GameUIProps> = ({
    energy,
    upgrades,
    achievements,
    canPrestige,
    prestigeGain,
    totalUpgradesOwned,
    settings,
    particles,
    floatingTexts,
    activePopup,
    showTutorial,
    showHardResetConfirm,
    showPrestigeConfirm,
    prestigeCount,
    purchasedPrestigeUpgrades,
    formattedEnergy,
    memoizedFormatNumber,
    onCollect,
    onBuyUpgrade,
    onPrestige,
    onConfirmPrestige,
    onBuyPrestigeUpgrade,
    onConfirmHardReset,
    onSettingsChange,
    removeParticle,
    removeFloatingText,
    setActivePopup,
    setShowTutorial,
    setShowHardResetConfirm,
    setShowPrestigeConfirm,
    playSfx,
}) => {
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
                formattedEnergy={formattedEnergy}
                onCollect={onCollect}
            />
            
            <UpgradeList 
                upgrades={upgrades}
                onBuyUpgrade={onBuyUpgrade}
                formatNumber={memoizedFormatNumber}
            />

            <Footer onMenuClick={(popup) => setActivePopup(popup)} />

            {activePopup === 'prestige' && (
                <PrestigePopup 
                    canPrestige={canPrestige} 
                    prestigeCount={prestigeCount}
                    prestigeGain={prestigeGain}
                    purchasedPrestigeUpgrades={purchasedPrestigeUpgrades}
                    onPrestige={onPrestige} 
                    onBuyPrestigeUpgrade={onBuyPrestigeUpgrade}
                    onClose={() => setActivePopup(null)} 
                    formatNumber={memoizedFormatNumber}
                    energy={energy}
                    totalUpgradesOwned={totalUpgradesOwned}
                />
            )}
            {activePopup === 'achievements' && (
                <AchievementsPopup achievements={achievements} onClose={() => setActivePopup(null)} />
            )}
            {activePopup === 'settings' && (
                <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => setActivePopup(null)} onHardReset={() => setShowHardResetConfirm(true)} />
            )}
            
            <TutorialPopup show={showTutorial} onClose={() => setShowTutorial(false)} />
            
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
                show={showPrestigeConfirm}
                title="Confirmer la Prestige"
                message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${prestigeGain} point(s) de prestige. Continuer ?`}
                onConfirm={onConfirmPrestige}
                onCancel={() => {
                    playSfx('click');
                    setShowPrestigeConfirm(false);
                }}
            />
        </div>
    );
};

export default GameUI;