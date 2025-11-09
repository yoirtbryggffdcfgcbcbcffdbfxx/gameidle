import React, { useEffect, useState, useRef } from 'react';
import { sfx } from '../audio/sfx';

interface TutorialStep {
    elementId?: string;
    text: string;
    isGlobal?: boolean;
}

const tutorialSteps: { [key: number]: TutorialStep } = {
    1: { 
        elementId: 'collect-button', 
        text: "Bienvenue, Capitaine. Je suis votre IA de bord. Commençons par générer de l'énergie. Cliquez sur ce bouton.",
    },
    2: {
        elementId: 'collect-button',
        text: "Excellent. Chaque clic produit de l'énergie. Continuez jusqu'à ce que vous ayez 10 unités pour acheter notre premier générateur.", 
    },
    3: {
        elementId: 'stats-display-container',
        text: "Observez ces statistiques. 'Prod/sec' est votre gain passif. 'Clic' est la puissance de chaque clic manuel.",
    },
    4: { 
        elementId: 'nav-forge', 
        text: "Parfait. Maintenant, utilisez le système de navigation pour vous rendre à la Forge et dépenser cette énergie.",
    },
    5: {
        elementId: 'upgrade-gen_1',
        text: "Voici les générateurs. Achetez celui-ci pour lancer notre production d'énergie passive. Il travaillera pour nous.",
    },
    6: {
        elementId: 'nav-command-center',
        text: "Systèmes autonomes en ligne. Rendez-vous au Centre de Commandement pour suivre nos progrès.",
    },
    7: {
        elementId: 'tab-achievements',
        text: "Ici, vous pouvez voir les Succès. En débloquer vous donne des bonus permanents. C'est un objectif clé.",
    },
    8: { 
        isGlobal: true, 
        text: "Vous maîtrisez les bases. Votre mission : générer, améliorer, et atteindre l'Ascension. Je serai en veille si nécessaire. Bonne chance.",
    },
};

interface AITutorialProps {
    step: number;
    setStep: (step: number) => void;
}

const AIAvatar = () => (
    <svg width="50" height="50" viewBox="0 0 100 100" className="animate-ai-bob flex-shrink-0 mr-3">
        <defs>
            <radialGradient id="ai-grad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#0b022d" />
            </radialGradient>
            <filter id="ai-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#ai-glow)">
            <path d="M 20 50 A 30 30 0 1 1 80 50 L 80 80 A 30 30 0 1 1 20 80 Z" fill="#222" stroke="#00f5d4" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="url(#ai-grad)" />
            <circle cx="50" cy="50" r="5" fill="#fff" />
        </g>
    </svg>
);

const AITutorial: React.FC<AITutorialProps> = ({ step, setStep }) => {
    const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);
    const [dialogPosition, setDialogPosition] = useState<'top' | 'bottom'>('bottom');
    const [charIndex, setCharIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isTextComplete, setIsTextComplete] = useState(false);
    const stepData = tutorialSteps[step];
    const probeRef = useRef<number | null>(null);

    const handleNext = () => {
        const nextStep = step + 1;
        if (tutorialSteps[nextStep]) {
            setStep(nextStep);
        } else {
            setStep(0);
        }
    };

    const handleSkip = () => setStep(0);
    
    useEffect(() => {
        setCharIndex(0);
        setIsTextComplete(false);

        if (stepData?.text) {
            const typingInterval = setInterval(() => {
                setCharIndex(prevIndex => {
                    if (prevIndex < stepData.text.length) {
                        if (sfx.typing) {
                            sfx.typing.currentTime = 0;
                            sfx.typing.volume = 0.3;
                            sfx.typing.play().catch(() => {});
                        }
                        return prevIndex + 1;
                    } else {
                        clearInterval(typingInterval);
                        setIsTextComplete(true);
                        return prevIndex;
                    }
                });
            }, 35);
            return () => clearInterval(typingInterval);
        }
    }, [stepData]);

    const typedText = stepData?.text.substring(0, charIndex) || '';

    useEffect(() => {
        const clearProbe = () => {
            if (probeRef.current) {
                clearInterval(probeRef.current);
                probeRef.current = null;
            }
        };

        clearProbe();
        setHighlightBox(null);
        setIsVisible(false);

        if (!stepData || step === 0) {
            return;
        }
        
        if (stepData.isGlobal) {
            setDialogPosition('bottom');
            setHighlightBox(null);
            setIsVisible(true);
            return;
        }

        if (!stepData.elementId) return;

        let previousRect: DOMRect | null = null;
        let stabilityCounter = 0;
        const requiredStableChecks = 5;
        const interval = 50;
        
        probeRef.current = window.setInterval(() => {
            const element = document.getElementById(stepData.elementId!);
            if (!element) return;

            const section = element.closest('.fullscreen-section');
            if (section && !section.classList.contains('revealed')) {
                stabilityCounter = 0;
                return;
            }

            const currentRect = element.getBoundingClientRect();
            if (currentRect.width === 0 || currentRect.height === 0) return;

            const isStable = previousRect && Math.abs(previousRect.top - currentRect.top) < 1 && Math.abs(previousRect.left - currentRect.left) < 1;

            if (isStable) {
                stabilityCounter++;
            } else {
                stabilityCounter = 0;
            }
            previousRect = currentRect;

            if (stabilityCounter >= requiredStableChecks) {
                clearProbe();
                setHighlightBox(currentRect);
                setDialogPosition(currentRect.top > window.innerHeight / 2 ? 'top' : 'bottom');
                setIsVisible(true);
            }
        }, interval);

        return clearProbe;
    }, [step, stepData]);
    
    if (step === 0 || !stepData) return null;

    const dialogClasses = `fixed z-[2002] w-full max-w-md p-4 flex items-start ${dialogPosition === 'top' ? 'top-5' : 'bottom-5'} left-1/2 -translate-x-1/2`;
    const isLastStep = !tutorialSteps[step + 1];
    
    const highlightBoxClasses = `absolute z-[2001] border-4 rounded-lg transition-all duration-300 pointer-events-none animate-fade-in-fast 
        ${(step === 1 || step === 2) ? 'animate-tutorial-pulse' : 'border-cyan-400'}`;

    const showHighlight = isVisible && highlightBox && (step !== 4 || isTextComplete);

    return (
        <div className="fixed inset-0 z-[2000]">
            {showHighlight ? (
                 <div 
                    className={highlightBoxClasses}
                    style={{
                        top: highlightBox.top - 8,
                        left: highlightBox.left - 8,
                        width: highlightBox.width + 16,
                        height: highlightBox.height + 16,
                        boxShadow: '0 0 0 9999px #000',
                    }}
                />
            ) : isVisible && (
                <div className="absolute inset-0 bg-black animate-fade-in-fast"></div>
            )}
            
            {isVisible && (
                <div className={`${dialogClasses} animate-fade-in-fast`}>
                    <AIAvatar />
                    <div className="bg-[var(--bg-popup)] p-3 rounded-lg flex-grow border border-cyan-500/50 shadow-lg">
                        <p className="text-sm min-h-[3em]">{typedText}<span className="inline-block w-0.5 h-4 bg-cyan-300 animate-pulse ml-1" /></p>
                        <div className="flex justify-end mt-3 text-xs space-x-2">
                            <button onClick={handleSkip} className="px-3 py-1 rounded bg-red-800/80 hover:bg-red-700 transition-colors">Passer</button>
                            <button onClick={handleNext} className="px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 transition-colors">{isLastStep ? "Terminer" : "Suivant"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITutorial;