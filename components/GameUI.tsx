import React, { useRef, useMemo } from 'react';

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
// Section Components
import CoreSection from './CoreSection';
import ForgeSection from './ForgeSection';
import CommandCenterSection from './CommandCenterSection';
import BankSection from './BankSection';
import AscensionSection from './AscensionSection';
import ReactorSection from './ReactorSection';

import { BANK_UNLOCK_TOTAL_ENERGY } from '../data/bank';

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
        setShowBankInfoPopup,
        setShowDevPanel
    } = useGameContext();

    const { ascensionLevel, totalEnergyProduced } = gameState;
    const { canAscend } = computedState;
    const { settings, particles, floatingTexts, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial, showDevPanel, showCoreTutorial, showBankTutorial, showBankInfoPopup } = uiState;
    const { setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial } = popups;
    const { onConfirmHardReset, onConfirmAscension, dev } = handlers;
    
    const gameContentRef = useRef<HTMLDivElement>(null);

    // --- UI Logic Hooks ---
    const showAscensionSection = useMemo(() => canAscend || ascensionLevel > 0, [canAscend, ascensionLevel]);
    const showReactorSection = useMemo(() => ascensionLevel > 0, [ascensionLevel]);
    const showBankSection = useMemo(() => totalEnergyProduced >= BANK_UNLOCK_TOTAL_ENERGY, [totalEnergyProduced]);

    const sections = useMemo(() => [
        { id: 'core', name: 'Cœur' },
        { id: 'forge', name: 'Forge' },
        { id: 'command-center', name: 'Commandement' },
        ...(showBankSection ? [{ id: 'bank', name: 'Banque' }] : []),
        ...(showAscensionSection ? [{ id: 'ascension-portal', name: 'Ascension' }] : []),
        ...(showReactorSection ? [{ id: 'reactor', name: 'Réacteur' }] : []),
    ], [showAscensionSection, showReactorSection, showBankSection]);

    const { activeSection, handleNavClick: baseHandleNavClick } = useScrollSpy(sections.map(s => s.id));
    useDragToScroll(gameContentRef);
    useRevealOnScroll('.reveal', [sections]);

    // --- Combined Logic for Nav Click ---
    const handleNavClick = (id: string) => {
        baseHandleNavClick(id);

        // Tutorial progression logic tied to navigation
        if (id === 'forge' && tutorialStep === 3) {
            setTutorialStep(4);
        }
        if (id === 'core' && tutorialStep === 5) {
            setTutorialStep(6);
        }
        if (id === 'command-center' && tutorialStep === 8) {
            setTutorialStep(9);
        }
    };

    return (
        <div ref={gameContentRef} id="game-content" className="h-full text-xs md:text-sm select-none">
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            <ScrollspyNav sections={sections} activeSection={activeSection} onNavClick={handleNavClick} />

            <main>
                <CoreSection />
                <ForgeSection />
                <CommandCenterSection />
                {showBankSection && <BankSection />}
                {showAscensionSection && <AscensionSection />}
                {showReactorSection && <ReactorSection />}
            </main>
            
            {/* Global Popups & Overlays */}
            <AITutorial step={tutorialStep} setStep={setTutorialStep} />
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}
            {showBankTutorial && <BankTutorialPopup onClose={() => setShowBankTutorial(false)} />}
            {showBankInfoPopup && <BankInfoPopup onClose={() => setShowBankInfoPopup(false)} />}
            {showDevPanel && <DevPanel 
                addEnergy={() => dev.setEnergy(computedState.maxEnergy)}
                addSpecificEnergy={dev.addEnergy}
                addAscension={onConfirmAscension}
                unlockAllUpgrades={() => {}}
                unlockAllAchievements={dev.unlockAllAchievements}
                resetAchievements={dev.resetAchievements}
                closePanel={() => setShowDevPanel(false)} />}
            <ConfirmationPopup show={showHardResetConfirm} title="Confirmer la réinitialisation" message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible." onConfirm={onConfirmHardReset} onCancel={() => { playSfx('click'); setShowHardResetConfirm(false); }} />
            <ConfirmationPopup show={showAscensionConfirm} title="Confirmer l'Ascension" message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${computedState.ascensionGain} point d'ascension et ${computedState.ascensionGain} Fragment Quantique. Continuer ?`} onConfirm={onConfirmAscension} onCancel={() => { playSfx('click'); setShowAscensionConfirm(false); }} />
        </div>
    );
};

export default GameUI;