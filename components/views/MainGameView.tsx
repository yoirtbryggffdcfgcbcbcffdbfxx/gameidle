import React, { useRef, useMemo, useEffect } from 'react';

// Hooks
import { useGameContext } from '../../contexts/GameContext';
import { useDragToScroll } from '../../hooks/ui/useDragToScroll';
import { useRevealOnScroll } from '../../hooks/ui/useRevealOnScroll';
import { useScrollSpy } from '../../hooks/ui/useScrollSpy';

// Components
import ScrollspyNav from '../ScrollspyNav';
import CoreSection from '../CoreSection';
import ForgeSection from '../ForgeSection';
import CommandCenterSection from '../CommandCenterSection';
import BankSection from '../BankSection';
import AscensionSection from '../AscensionSection';
import AITutorial from '../AITutorial';
import { getNextFragmentCost } from '../../data/quantumFragments';
import FloatingIconButton from '../ui/FloatingIconButton';
import ShopIcon from '../ui/ShopIcon';

const MainGameView: React.FC = () => {
    const { gameState, computedState, uiState, handlers, popups } = useGameContext();
    const { ascensionLevel, energy, viewedCategories, isCoreUnlocked, hasUnseenShopItems, quantumShards, isShopUnlocked } = gameState;
    const { canAscend, newlyVisibleUpgradeTypes } = computedState;
    const { tutorialStep } = uiState;
    const { setTutorialStep } = popups;
    const { markShopItemsAsSeen, enterShopInterface } = handlers;
    
    const gameContentRef = useRef<HTMLDivElement>(null);

    const showAscensionSection = useMemo(() => canAscend || ascensionLevel > 0, [canAscend, ascensionLevel]);
    
    const showBankSection = useMemo(() => {
        return gameState.isBankDiscovered;
    }, [gameState.isBankDiscovered]);
    
    const sections = useMemo(() => [
        { id: 'core', name: 'Cœur' },
        { id: 'forge', name: 'Forge' },
        { id: 'command-center', name: 'Commandement' },
        ...(showBankSection ? [{ id: 'bank', name: 'Banque' }] : []),
        ...(showAscensionSection ? [{ id: 'ascension-portal', name: 'Ascension' }] : []),
    ], [showAscensionSection, showBankSection]);

    const { activeSection, handleNavClick: baseHandleNavClick } = useScrollSpy(sections.map(s => s.id));
    useDragToScroll(gameContentRef);
    useRevealOnScroll('.reveal', [sections]);
    
    const prevActiveSectionRef = useRef<string | undefined>(undefined);
    useEffect(() => {
        if (prevActiveSectionRef.current === 'command-center' && activeSection !== 'command-center' && hasUnseenShopItems) {
            markShopItemsAsSeen();
        }
        prevActiveSectionRef.current = activeSection;
    }, [activeSection, hasUnseenShopItems, markShopItemsAsSeen]);

    const handleNavClick = (id: string) => {
        baseHandleNavClick(id);
        if (id === 'forge' && tutorialStep === 3) setTutorialStep(4);
        if (id === 'core' && tutorialStep === 5) setTutorialStep(6);
        if (id === 'command-center' && tutorialStep === 8) setTutorialStep(9);
    };
    
    const hasNewUpgrades = useMemo(() => {
        if (tutorialStep !== 0 || newlyVisibleUpgradeTypes.size === 0) return false;
        return [...newlyVisibleUpgradeTypes].some(type => !viewedCategories.includes(type));
    }, [tutorialStep, newlyVisibleUpgradeTypes, viewedCategories]);

    const canAffordFragment = useMemo(() => isCoreUnlocked && energy >= getNextFragmentCost(quantumShards), [isCoreUnlocked, energy, quantumShards]);
    const showShopNotification = useMemo(() => hasUnseenShopItems || canAffordFragment, [hasUnseenShopItems, canAffordFragment]);

    return (
        <>
            <ScrollspyNav 
                sections={sections} 
                activeSection={activeSection} 
                onNavClick={handleNavClick}
                newUpgradesAvailable={hasNewUpgrades}
            />
            {isShopUnlocked && (
                <FloatingIconButton
                    onClick={enterShopInterface}
                    icon={<ShopIcon className="w-7 h-7 md:w-8 md:h-8" />}
                    hasNotification={showShopNotification}
                    className="top-4 right-4 md:right-20"
                    title="Ouvrir la Boutique"
                />
            )}
            <div
                ref={gameContentRef}
                id="game-content"
                className={`h-full text-xs md:text-sm select-none ${tutorialStep > 0 ? 'tutorial-active-scroll-lock' : ''}`}
            >
                <main>
                    <CoreSection />
                    <ForgeSection />
                    <CommandCenterSection />
                    {showBankSection && <BankSection />}
                    {showAscensionSection && <AscensionSection />}
                </main>
            </div>
            <AITutorial
                step={tutorialStep}
                setStep={setTutorialStep}
                scrollToSection={handleNavClick}
            />
        </>
    );
};

export default MainGameView;