
import React, { useState, useMemo, useRef, useEffect } from 'react';
import AchievementsPopup from './popups/AchievementsPopup';
import SettingsPopup from './popups/SettingsPopup';
import { useGameContext } from '../contexts/GameContext';
import MobileNav from './MobileNav';
import GameStatsDisplay from './command_center/GameStatsDisplay';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
import ColoredAwardIcon from './ui/ColoredAwardIcon';
import ColoredSettingsIcon from './ui/ColoredSettingsIcon';

interface Tab {
    id: 'stats' | 'achievements' | 'settings';
    name: string;
    icon: React.ReactNode;
    condition: boolean;
    hasNotification?: boolean;
}

const CommandCenterSection: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups, playSfx } = useGameContext();
    const { achievements } = gameState;
    const { achievementBonuses } = computedState;
    const { settings, tutorialStep } = uiState;
    const { onSettingsChange } = handlers;
    const { setShowHardResetConfirm, setTutorialStep, setActiveMobilePopup } = popups;
    
    const [activeCommandCenterTab, setActiveCommandCenterTab] = useState<'stats' | 'achievements' | 'settings'>('stats');

    // Refs for scrolling
    const mobileStatsScrollableRef = useRef<HTMLDivElement>(null);
    const desktopStatsScrollableRef = useRef<HTMLDivElement>(null);
    useDragToScroll(mobileStatsScrollableRef);
    useDragToScroll(desktopStatsScrollableRef);

    // Auto-open Achievements tab/popup on Tutorial Step 9
    useEffect(() => {
        if (tutorialStep === 9) {
            // Desktop: Switch tab
            setActiveCommandCenterTab('achievements');
            
            // Mobile: Open popup if screen is small
            if (window.innerWidth < 768) {
                setActiveMobilePopup('achievements');
            }
        }
    }, [tutorialStep, setActiveMobilePopup]);

    // Lock main page scroll when interacting with the stats panel to prevent scroll bleed
    useEffect(() => {
        const gameContentEl = document.getElementById('game-content');
        if (!gameContentEl) return;
    
        const lockScroll = () => { gameContentEl.style.overflowY = 'hidden'; };
        const unlockScroll = () => { gameContentEl.style.overflowY = 'auto'; };

        const addListeners = (el: HTMLElement) => {
            el.addEventListener('mouseenter', lockScroll);
            el.addEventListener('mouseleave', unlockScroll);
            el.addEventListener('touchstart', lockScroll, { passive: true });
            el.addEventListener('touchend', unlockScroll);
            el.addEventListener('touchcancel', unlockScroll);
        };

        const removeListeners = (el: HTMLElement) => {
            el.removeEventListener('mouseenter', lockScroll);
            el.removeEventListener('mouseleave', unlockScroll);
            el.removeEventListener('touchstart', lockScroll);
            el.removeEventListener('touchend', unlockScroll);
            el.removeEventListener('touchcancel', unlockScroll);
        };
    
        const mobileEl = mobileStatsScrollableRef.current;
        const desktopEl = desktopStatsScrollableRef.current;
        
        if (mobileEl) addListeners(mobileEl);
        if (desktopEl) addListeners(desktopEl);
    
        return () => {
            if (mobileEl) removeListeners(mobileEl);
            if (desktopEl) removeListeners(desktopEl);
            unlockScroll();
        };
    }, []);

    const handleCommandCenterTabClick = (tabId: 'stats' | 'achievements' | 'settings') => {
        setActiveCommandCenterTab(tabId);
        if (tabId === 'achievements' && tutorialStep === 9) {
            // Note: Auto-open handles step 9 UI reveal. 
            // Step advancement to 10 is handled by the user clicking "Next" on the AI Dialog or similar interaction.
        }
    };
    
    const handleMobileTabClick = (tabId: 'achievements' | 'settings') => {
        setActiveMobilePopup(tabId as 'achievements' | 'settings');
    }

    // FIX: Add type assertion to the array literal to prevent TypeScript from widening the `id` property to a generic `string`.
    // The .filter() call prevents contextual typing from the variable assignment, so we must be explicit.
    const commandCenterTabs: Omit<Tab, 'hasNotification'>[] = ([
        { id: 'stats', name: 'Stats', icon: <span className="text-xl">📊</span>, condition: true },
        { id: 'achievements', name: 'Succès', icon: <ColoredAwardIcon className="w-6 h-6" />, condition: true },
        { id: 'settings', name: 'Paramètres', icon: <ColoredSettingsIcon className="w-6 h-6" />, condition: true },
    ] as Omit<Tab, 'hasNotification'>[]).filter(tab => tab.condition);

    const mobileNavTabs = commandCenterTabs.filter(tab => tab.id !== 'stats');

    return (
        <section id="command-center" className="fullscreen-section reveal">
             {/* UNIFIED GLASS PANEL STYLE */}
            <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a12]/70 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="w-full flex justify-center items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl text-[var(--text-header)]">Commandement</h2>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex justify-center border-b border-[var(--border-color)] mb-4 flex-shrink-0">
                    {commandCenterTabs.map(tab => (
                        <button
                            key={tab.id}
                            id={`tab-desktop-${tab.id}`}
                            onClick={() => handleCommandCenterTabClick(tab.id)}
                            className={`px-4 py-2 text-sm md:text-base transition-all duration-300 relative ${activeCommandCenterTab === tab.id ? 'text-[var(--text-header)]' : 'text-gray-400'}`}
                        >
                            <span className="relative flex items-center gap-2">
                                {tab.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Desktop Content Area */}
                <div className="hidden md:block flex-grow overflow-hidden">
                     {activeCommandCenterTab === 'stats' && (
                        <div ref={desktopStatsScrollableRef} className="h-full overflow-y-auto custom-scrollbar pr-2 scroll-contain">
                            <GameStatsDisplay />
                        </div>
                    )}
                    {activeCommandCenterTab === 'achievements' && (
                        <AchievementsPopup 
                            achievements={achievements} 
                            achievementBonuses={achievementBonuses} 
                            onClose={() => { }} 
                            containerId="achievements-desktop"
                        />
                    )}
                    {activeCommandCenterTab === 'settings' && (
                        <SettingsPopup settings={settings} onSettingsChange={onSettingsChange} onClose={() => { }} onHardReset={() => setShowHardResetConfirm(true)} playSfx={playSfx} />
                    )}
                </div>
                
                {/* Mobile Stats Display */}
                 <div ref={mobileStatsScrollableRef} className="md:hidden flex-grow overflow-y-auto custom-scrollbar pr-2 scroll-contain min-h-0">
                    <GameStatsDisplay />
                </div>
                <MobileNav
                    tabs={mobileNavTabs}
                    onTabClick={handleMobileTabClick}
                />
            </div>
        </section>
    );
};

export default CommandCenterSection;
