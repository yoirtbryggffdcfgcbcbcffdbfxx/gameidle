import React, { useRef, useMemo, useEffect } from 'react';

// Hooks
import { useGameContext } from '../contexts/GameContext';
import { useDragToScroll } from '../hooks/ui/useDragToScroll';
import { useRevealOnScroll } from '../hooks/ui/useRevealOnScroll';
import { useScrollSpy } from '../hooks/ui/useScrollSpy';

// Components
import FlowingParticle from './ui/FlowingParticle';
import FloatingText from './ui/FloatingText';
import ConfirmationPopup from './popups/ConfirmationPopup';
import DevPanel from './popups/DevPanel';
import AscensionTutorialPopup from './popups/AscensionTutorialPopup';
import CoreTutorialPopup from './popups/CoreTutorialPopup';
import BankTutorialPopup from './popups/BankTutorialPopup';
import BankInfoPopup from './popups/BankInfoPopup';
import ScrollspyNav from './ScrollspyNav';
import AITutorial from './AITutorial';
import QuantumInterface from './QuantumInterface'; // Path selection
import QuantumPathInterface from './quantum/path/QuantumPathInterface'; // Path progression
// Section Components
import CoreSection from './CoreSection';
import ForgeSection from './ForgeSection';
import CommandCenterSection from './CommandCenterSection';
import BankSection from './BankSection';
import AscensionSection from './AscensionSection';

import { BANK_UNLOCK_TOTAL_ENERGY } from '../data/bank';
import ShopTutorialPopup from './popups/ShopTutorialPopup';
import { QUANTUM_PATHS } from '../data/quantumPaths';
import { getNextFragmentCost } from '../data/quantumFragments';

const GameUI: React.FC = () => {
    const { 
        gameState,
        computedState,
        uiState, 
        handlers, 
        popups,
        playSfx, 
        removeParticle, 
        removeFloatingText,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowShopTutorial,
        setShowBankInfoPopup,
        setShowDevPanel,
        setShowQuantumPathConfirm,
    } = useGameContext();

    const { ascensionLevel, energy, viewedCategories, isCoreUnlocked, isShopUnlocked, hasUnseenShopItems, quantumShards } = gameState;
    const { canAscend, newlyVisibleUpgradeTypes, maxEnergy } = computedState;
    const { settings, particles, floatingTexts, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial, showDevPanel, showCoreTutorial, showBankTutorial, showShopTutorial, showBankInfoPopup, activeView, showQuantumPathConfirm, pathChoiceToConfirm } = uiState;
    const { setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial } = popups;
    const { onConfirmHardReset, onConfirmAscension, dev, markShopItemsAsSeen, onConfirmQuantumPath } = handlers;
    
    const gameContentRef = useRef<HTMLDivElement>(null);

    // --- UI Logic Hooks ---
    const showAscensionSection = useMemo(() => canAscend || ascensionLevel > 0, [canAscend, ascensionLevel]);
    const showBankSection = useMemo(() => energy >= BANK_UNLOCK_TOTAL_ENERGY, [energy]);
    
    const displayMaxEnergy = useMemo(() => {
        if (!isShopUnlocked) {
            return 1000;
        }
        if (!isCoreUnlocked) {
            return 10000;
        }
        return maxEnergy;
    }, [isShopUnlocked, isCoreUnlocked, maxEnergy]);

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

    return (
        <>
            {/* Global effects that should render on top of everything */}
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            {/* Main Game View (conditionally hidden to preserve state and scroll position) */}
            <div
                ref={gameContentRef}
                id="game-content"
                className={`h-full text-xs md:text-sm select-none ${tutorialStep > 0 ? 'tutorial-active-scroll-lock' : ''}`}
                style={{ display: activeView === 'main' ? 'block' : 'none' }}
            >
                <ScrollspyNav 
                    sections={sections} 
                    activeSection={activeSection} 
                    onNavClick={handleNavClick}
                    newUpgradesAvailable={hasNewUpgrades}
                    newShopItemsAvailable={hasUnseenShopItems || canAffordFragment}
                />
                <main>
                    <CoreSection />
                    <ForgeSection />
                    <CommandCenterSection />
                    {showBankSection && <BankSection />}
                    {showAscensionSection && <AscensionSection />}
                </main>
            </div>
            
            {/* Quantum Interface Views (conditionally rendered) */}
            {activeView === 'quantum_core' && <QuantumInterface />}
            {activeView === 'quantum_path' && <QuantumPathInterface />}

            {/* Global Popups & Overlays that must be outside the main scrolling container */}
            <AITutorial
                step={tutorialStep}
                setStep={setTutorialStep}
                scrollToSection={handleNavClick}
            />
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showShopTutorial && <ShopTutorialPopup onClose={() => setShowShopTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}
            {showBankTutorial && <BankTutorialPopup onClose={() => setShowBankTutorial(false)} />}
            {showBankInfoPopup && <BankInfoPopup onClose={() => setShowBankInfoPopup(false)} />}
            {showDevPanel && <DevPanel 
                addEnergy={() => dev.setEnergy(displayMaxEnergy)}
                addSpecificEnergy={dev.addEnergy}
                addAscension={onConfirmAscension}
                unlockAllUpgrades={() => {}}
                unlockAllAchievements={dev.unlockAllAchievements}
                resetAchievements={dev.resetAchievements}
                closePanel={() => setShowDevPanel(false)} />}
            <ConfirmationPopup show={showHardResetConfirm} title="Confirmer la réinitialisation" message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible." onConfirm={onConfirmHardReset} onCancel={() => { playSfx('click'); setShowHardResetConfirm(false); }} />
            <ConfirmationPopup show={showAscensionConfirm} title="Confirmer l'Ascension" message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${computedState.ascensionGain} point d'ascension. Continuer ?`} onConfirm={onConfirmAscension} onCancel={() => { playSfx('click'); setShowAscensionConfirm(false); }} />
            {pathChoiceToConfirm && (
                 <ConfirmationPopup 
                    show={showQuantumPathConfirm} 
                    title={`Choisir la Voie du ${QUANTUM_PATHS[pathChoiceToConfirm].name} ?`} 
                    message="Ce choix est permanent pour cette Ascension et définira la manière dont votre Cœur Quantique évoluera. Êtes-vous sûr ?" 
                    onConfirm={onConfirmQuantumPath} 
                    onCancel={() => { playSfx('click'); setShowQuantumPathConfirm(false); }} 
                />
            )}
        </>
    );
};

export default GameUI;