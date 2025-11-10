import React, { useState, useEffect, useRef, useMemo } from 'react';

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
import { useGameContext } from '../contexts/GameContext';


const GameUI: React.FC = () => {
    const { 
        gameState,
        computedState,
        uiState, 
        handlers, 
        popups,
        playSfx, 
        addFloatingText, 
        removeParticle, 
        removeFloatingText,
        setShowCoreTutorial,
        setShowBankTutorial,
        setShowBankInfoPopup,
        // FIX: Destructure `setShowDevPanel` from context to resolve reference error.
        setShowDevPanel
    } = useGameContext();

    const { ascensionLevel, totalEnergyProduced, energy, upgrades } = gameState;
    const { canAscend, productionTotal } = computedState;
    const { settings, particles, floatingTexts, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial, showDevPanel, showCoreTutorial, showBankTutorial, showBankInfoPopup } = uiState;
    const { setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial } = popups;
    const { onConfirmHardReset, onConfirmAscension, dev } = handlers;
    
    const [activeSection, setActiveSection] = useState('core');
    const gameContentRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<number | null>(null);
    
    const showAscensionSection = useMemo(() => canAscend || ascensionLevel > 0, [canAscend, ascensionLevel]);
    const showReactorSection = useMemo(() => ascensionLevel > 0, [ascensionLevel]);
    const showBankSection = useMemo(() => totalEnergyProduced >= 100000, [totalEnergyProduced]);

    const sections = useMemo(() => [
        { id: 'core', name: 'Cœur' },
        { id: 'forge', name: 'Forge' },
        { id: 'command-center', name: 'Commandement' },
        ...(showBankSection ? [{ id: 'bank', name: 'Banque' }] : []),
        ...(showAscensionSection ? [{ id: 'ascension-portal', name: 'Ascension' }] : []),
        ...(showReactorSection ? [{ id: 'reactor', name: 'Réacteur' }] : []),
    ], [showAscensionSection, showReactorSection, showBankSection]);

    const handleNavClick = (id: string) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        isScrollingRef.current = true;
        
        setActiveSection(id);
        
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        
        scrollTimeoutRef.current = window.setTimeout(() => {
            isScrollingRef.current = false;
        }, 1000);

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


    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        const elementsToReveal = document.querySelectorAll('.reveal');
        elementsToReveal.forEach(el => revealObserver.observe(el));
        
        const scrollspyObserver = new IntersectionObserver((entries) => {
            if (isScrollingRef.current) return;

            const mostVisibleEntry = entries.reduce((prev, current) => 
                (prev.intersectionRatio > current.intersectionRatio) ? prev : current
            );

            if (mostVisibleEntry && mostVisibleEntry.isIntersecting) {
                setActiveSection(mostVisibleEntry.target.id);
            }
        }, { threshold: Array.from(Array(21).keys()).map(i => i / 20) });

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) scrollspyObserver.observe(el);
        });

        return () => {
             elementsToReveal.forEach(el => revealObserver.unobserve(el));
             sections.forEach(section => {
                const el = document.getElementById(section.id);
                if (el) scrollspyObserver.unobserve(el);
            });
        };
    }, [sections]);
    
    useEffect(() => {
        if (activeSection !== 'core' || productionTotal <= 0) return;

        const interval = setInterval(() => {
            if (productionTotal > 0) {
                 addFloatingText(`+${handlers.dev.addEnergy.toString()}`, window.innerWidth / 3, window.innerHeight / 2, '#00ffcc');
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [activeSection, productionTotal, addFloatingText, handlers.dev.addEnergy]);
    
    useEffect(() => {
        const el = gameContentRef.current;
        if (!el) return;

        let isDown = false;
        let startY: number;
        let scrollTop: number;

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('nav') || target.closest('button')) {
                return;
            }
            
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
            const walk = (y - startY) * 2;
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
        if (tutorialStep === 2 && energy >= firstUpgradeCost) {
            setTutorialStep(3); 
        }
    }, [energy, tutorialStep, setTutorialStep, upgrades]);

    const handleDevSetMaxEnergyForAscension = () => dev.setEnergy(computedState.maxEnergy);

    return (
        <div ref={gameContentRef} id="game-content" className="min-h-full text-xs md:text-sm select-none">
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
            {/* FIX: Correctly pass props to DevPanel to match its expected signature. */}
            {showDevPanel && <DevPanel 
                addEnergy={handleDevSetMaxEnergyForAscension}
                addSpecificEnergy={dev.addEnergy}
                addAscension={dev.addAscension}
                unlockAllUpgrades={dev.unlockAllUpgrades}
                unlockAllAchievements={dev.unlockAllAchievements}
                resetAchievements={dev.resetAchievements}
                closePanel={() => setShowDevPanel(false)} />}
            <ConfirmationPopup show={showHardResetConfirm} title="Confirmer la réinitialisation" message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible." onConfirm={onConfirmHardReset} onCancel={() => { playSfx('click'); setShowHardResetConfirm(false); }} />
            <ConfirmationPopup show={showAscensionConfirm} title="Confirmer l'Ascension" message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${computedState.ascensionGain} point d'ascension et ${computedState.ascensionGain} Fragment Quantique. Continuer ?`} onConfirm={onConfirmAscension} onCancel={() => { playSfx('click'); setShowAscensionConfirm(false); }} />
        </div>
    );
};

export default GameUI;
