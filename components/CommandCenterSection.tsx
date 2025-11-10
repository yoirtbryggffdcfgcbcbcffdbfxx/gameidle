import React, { useState } from 'react';
import { Settings, Achievement } from '../types';
import AchievementsPopup from './popups/AchievementsPopup';
import ShopPopup from './popups/ShopPopup';
import SettingsPopup from './popups/SettingsPopup';

interface CommandCenterSectionProps {
    energy: number;
    quantumShards: number;
    achievements: Achievement[];
    achievementBonuses: { production: number; click: number; coreCharge: number; costReduction: number; };
    purchasedShopUpgrades: string[];
    onBuyShopUpgrade: (id: string) => void;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    setShowHardResetConfirm: (show: boolean) => void;
    playSfx: (sound: any) => void;
    formatNumber: (num: number) => string;
    tutorialStep: number;
    setTutorialStep: (step: number) => void;
}

const CommandCenterSection: React.FC<CommandCenterSectionProps> = (props) => {
    const [activeCommandCenterTab, setActiveCommandCenterTab] = useState('achievements');

    const handleCommandCenterTabClick = (tab: string) => {
        setActiveCommandCenterTab(tab);
        if (tab === 'achievements' && props.tutorialStep === 9) {
            props.setTutorialStep(10);
        }
    };

    return (
        <section id="command-center" className="fullscreen-section reveal">
            <div className="w-full max-w-4xl h-[80vh] bg-black/20 rounded-lg p-4 flex flex-col">
                <div className="w-full flex justify-between items-center mb-4">
                    <h2 className="text-2xl text-center text-[var(--text-header)]">Centre de Commandement</h2>
                    <div className="bg-black/30 px-3 py-1 rounded-lg text-xs flex gap-4">
                        <span className="text-purple-400">⚛️ {props.formatNumber(props.quantumShards)}</span>
                        <span className="text-cyan-300">⚡ {props.formatNumber(props.energy)}</span>
                    </div>
                </div>
                <div className="flex justify-center border-b border-[var(--border-color)] mb-4">
                    {['achievements', 'shop', 'settings'].map(tab => (
                        <button
                            key={tab}
                            id={`tab-${tab}`}
                            onClick={() => handleCommandCenterTabClick(tab)}
                            className={`px-4 py-2 text-sm md:text-base transition-all duration-300 relative ${activeCommandCenterTab === tab ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            {tab === 'achievements' ? 'Succès' : tab === 'shop' ? 'Boutique' : 'Paramètres'}
                        </button>
                    ))}
                </div>
                <div className="flex-grow overflow-hidden relative">
                    <div id="achievements-panel" className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'achievements' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <AchievementsPopup achievements={props.achievements} achievementBonuses={props.achievementBonuses} onClose={() => { }} />
                    </div>
                    <div id="shop-panel" className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'shop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <ShopPopup
                            quantumShards={props.quantumShards}
                            purchasedShopUpgrades={props.purchasedShopUpgrades}
                            onBuy={props.onBuyShopUpgrade}
                        />
                    </div>
                    <div className={`w-full h-full absolute transition-opacity duration-300 ${activeCommandCenterTab === 'settings' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <SettingsPopup settings={props.settings} onSettingsChange={props.onSettingsChange} onClose={() => { }} onHardReset={() => props.setShowHardResetConfirm(true)} playSfx={props.playSfx} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommandCenterSection;
