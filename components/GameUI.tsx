import React, { useState, useEffect, useRef, useMemo } from 'react';

// Types
import { Settings, Upgrade, Achievement, Particle, FloatingText as FloatingTextType } from '../types';

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
    purchasedShopUpgrades: string[];
    ascensionBonuses: { productionMultiplier: number; clickMultiplier: number; costReduction: number; startingEnergy: number; };
    achievementBonuses: { production: number; click: number; coreCharge: number; costReduction: number; };
    coreBonuses: { chargeRate: number; multiplier: number; };
    bankBonuses: { savingsInterest: number; loanInterest: number; };
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
    showBankTutorial: boolean;
    showBankInfoPopup: boolean;
    totalEnergyProduced: number;
    isBankUnlocked: boolean;
    savingsBalance: number;
    currentLoan: { amount: number; remaining: number; } | null;
    bankLevel: number;
    costMultiplier: number;


    // Callbacks & Handlers
    onCollect: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onBuyUpgrade: (index: number, amount: number | 'MAX') => void;
    onAscend: () => void;
    onConfirmAscension: () => void;
    onBuyAscensionUpgrade: (id: string) => void;
    onBuyCoreUpgrade: (id: string) => void;
    onBuyShopUpgrade: (id: string) => void;
    onConfirmHardReset: () => void;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
    onDischargeCore: () => void;
    onBuildBank: () => void;
    onDepositSavings: (amount: number) => void;
    onWithdrawSavings: (amount: number, isPercentage: boolean) => void;
    onTakeOutLoan: (amount: number) => void;
    onUpgradeBank: () => void;
    dev: {
        addEnergy: () => void;
        addSpecificEnergy: (amount: number) => void;
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
    setShowBankTutorial: (show: boolean) => void;
    setShowBankInfoPopup: (show: boolean) => void;
}

const GameUI: React.FC<GameUIProps> = (props) => {
    const {
        upgrades, ascensionLevel, canAscend, totalEnergyProduced,
        settings, particles, floatingTexts, tutorialStep, showHardResetConfirm, showAscensionConfirm, showAscensionTutorial,
        playSfx, formatNumber, addFloatingText, removeParticle, removeFloatingText, setTutorialStep, setShowHardResetConfirm, setShowAscensionConfirm, setShowAscensionTutorial,
        showDevPanel, dev, showCoreTutorial, setShowCoreTutorial, showBankTutorial, setShowBankTutorial, showBankInfoPopup, setShowBankInfoPopup, productionTotal
    } = props;

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
    }, [props.visibleUpgrades.length, sections]);
    
    useEffect(() => {
        if (activeSection !== 'core' || productionTotal <= 0) return;

        const interval = setInterval(() => {
            if (productionTotal > 0) {
                 addFloatingText(`+${formatNumber(productionTotal)}`, window.innerWidth / 3, window.innerHeight / 2, '#00ffcc');
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [activeSection, productionTotal, addFloatingText, formatNumber]);
    
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
        if (tutorialStep === 2 && props.energy >= firstUpgradeCost) {
            setTutorialStep(3); 
        }
    }, [props.energy, tutorialStep, setTutorialStep, upgrades]);

    return (
        <div ref={gameContentRef} id="game-content" className="min-h-full text-xs md:text-sm select-none">
            {particles.map(p => <FlowingParticle key={p.id} {...p} animSpeed={settings.animSpeed} onComplete={removeParticle} />)}
            {floatingTexts.map(ft => <FloatingText key={ft.id} {...ft} onComplete={removeFloatingText} />)}
            
            <ScrollspyNav sections={sections} activeSection={activeSection} onNavClick={handleNavClick} />

            <main>
                <CoreSection
                    energy={props.energy}
                    maxEnergy={props.maxEnergy}
                    formatNumber={formatNumber}
                    productionTotal={props.productionTotal}
                    clickPower={props.clickPower}
                    onCollect={props.onCollect}
                />
                
                <ForgeSection
                    energy={props.energy}
                    formatNumber={formatNumber}
                    visibleUpgrades={props.visibleUpgrades}
                    onBuyUpgrade={props.onBuyUpgrade}
                    productionTotal={props.productionTotal}
                    costMultiplier={props.costMultiplier}
                    playSfx={playSfx}
                    purchasedShopUpgrades={props.purchasedShopUpgrades}
                />
                
                <CommandCenterSection
                    energy={props.energy}
                    quantumShards={props.quantumShards}
                    achievements={props.achievements}
                    achievementBonuses={props.achievementBonuses}
                    purchasedShopUpgrades={props.purchasedShopUpgrades}
                    onBuyShopUpgrade={props.onBuyShopUpgrade}
                    settings={settings}
                    onSettingsChange={props.onSettingsChange}
                    setShowHardResetConfirm={setShowHardResetConfirm}
                    playSfx={playSfx}
                    formatNumber={formatNumber}
                    tutorialStep={tutorialStep}
                    setTutorialStep={setTutorialStep}
                />
                
                {showBankSection && <BankSection {...props} />}
                {showAscensionSection && <AscensionSection {...props} />}
                {showReactorSection && <ReactorSection {...props} />}
            </main>
            
            {/* Global Popups & Overlays */}
            <AITutorial step={tutorialStep} setStep={setTutorialStep} />
            {showAscensionTutorial && <AscensionTutorialPopup onClose={() => setShowAscensionTutorial(false)} />}
            {showCoreTutorial && <CoreTutorialPopup onClose={() => setShowCoreTutorial(false)} />}
            {showBankTutorial && <BankTutorialPopup onClose={() => setShowBankTutorial(false)} />}
            {showBankInfoPopup && <BankInfoPopup onClose={() => setShowBankInfoPopup(false)} />}
            {showDevPanel && <DevPanel {...dev} />}
            <ConfirmationPopup show={showHardResetConfirm} title="Confirmer la réinitialisation" message="Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible." onConfirm={props.onConfirmHardReset} onCancel={() => { playSfx('click'); setShowHardResetConfirm(false); }} />
            <ConfirmationPopup show={showAscensionConfirm} title="Confirmer l'Ascension" message={`Vous êtes sur le point de réinitialiser votre progression pour gagner ${props.ascensionGain} point d'ascension et ${props.ascensionGain} Fragment Quantique. Continuer ?`} onConfirm={props.onConfirmAscension} onCancel={() => { playSfx('click'); setShowAscensionConfirm(false); }} />
        </div>
    );
};

export default GameUI;
