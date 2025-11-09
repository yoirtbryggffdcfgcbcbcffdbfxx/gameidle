import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { sfx } from '../audio/sfx';

interface TutorialStep {
    elementIds?: string[];
    text: string;
    isGlobal?: boolean;
}

const tutorialSteps: { [key: number]: TutorialStep } = {
    1: { 
        elementIds: ['collect-button'], 
        text: "Bienvenue, Capitaine. Je suis votre IA de bord. Commençons par générer de l'énergie. Cliquez sur ce bouton.",
    },
    2: {
        elementIds: ['energy-bar-container', 'collect-button'],
        text: "Excellent. L'énergie que vous collectez remplit cette barre. Continuez jusqu'à 15 unités pour notre premier achat.", 
    },
    3: { 
        elementIds: ['nav-forge'], 
        text: "Parfait. Maintenant, utilisez la navigation pour vous rendre à la Forge et dépenser cette énergie.",
    },
    4: {
        elementIds: ['upgrade-gen_1'],
        text: "Voici les générateurs. Achetez celui-ci pour lancer notre production d'énergie passive. Il travaillera pour nous.",
    },
    5: {
        elementIds: ['nav-core'],
        text: "Générateur activé ! Retournons au Cœur pour voir ses effets."
    },
    6: {
        elementIds: ['stat-prod'],
        text: "Regardez ! Votre 'Prod/sec' a augmenté. Vous gagnez maintenant de l'énergie automatiquement."
    },
    7: {
        elementIds: ['stat-click'],
        text: "Et ceci est votre puissance de 'Clic', l'énergie que vous gagnez à chaque clic manuel. Vous pourrez aussi l'améliorer."
    },
    8: {
        elementIds: ['nav-command-center'],
        text: "Bien. Allons au Centre de Commandement pour suivre nos progrès.",
    },
    9: {
        elementIds: ['achievements-panel'],
        text: "Ici, vous pouvez voir les Succès. En débloquer vous donne des bonus permanents. C'est un objectif clé.",
    },
    10: { 
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

const getCombinedBoundingBox = (elementIds: string[]): DOMRect | null => {
    const elements = elementIds
        .map(id => document.getElementById(id))
        .filter(el => el !== null) as HTMLElement[];
    
    if (elements.length === 0) return null;

    const rects = elements.map(el => el.getBoundingClientRect());
    
    if (rects.some(rect => rect.width === 0 || rect.height === 0)) return null;

    const left = Math.min(...rects.map(r => r.left));
    const top = Math.min(...rects.map(r => r.top));
    const right = Math.max(...rects.map(r => r.right));
    const bottom = Math.max(...rects.map(r => r.bottom));

    return new DOMRect(left, top, right - left, bottom - top);
};

const AITutorial: React.FC<AITutorialProps> = ({ step, setStep }) => {
    const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);
    const [dialogPosition, setDialogPosition] = useState<'top' | 'bottom'>('bottom');
    const [charIndex, setCharIndex] = useState(0);
    const stepData = tutorialSteps[step];
    const probeRef = useRef<number | null>(null);

    const handleNext = () => {
        const nextStep = step + 1;
        setStep(tutorialSteps[nextStep] ? nextStep : 0);
    };
    const handleSkip = () => setStep(0);

    // Typing effect for the dialog text
    useEffect(() => {
        setCharIndex(0);
        if (!stepData?.text) return;

        const typingInterval = setInterval(() => {
            setCharIndex(prevIndex => {
                if (prevIndex < stepData.text.length) {
                    if (sfx.typing) {
                        sfx.typing.currentTime = 0;
                        sfx.typing.volume = 0.3;
                        sfx.typing.play().catch(() => {});
                    }
                    return prevIndex + 1;
                }
                clearInterval(typingInterval);
                return prevIndex;
            });
        }, 35);
        return () => clearInterval(typingInterval);
    }, [step, stepData]);

    const typedText = stepData?.text.substring(0, charIndex) || '';

    // Effect to find and highlight the target element
    useLayoutEffect(() => {
        const clearProbe = () => {
            if (probeRef.current) {
                clearInterval(probeRef.current);
                probeRef.current = null;
            }
        };

        clearProbe();
        setHighlightBox(null);

        if (!stepData || step === 0 || stepData.isGlobal) return;
        if (!stepData.elementIds || stepData.elementIds.length === 0) return;

        let previousRectJSON: string | null = null;
        let stabilityCounter = 0;
        const requiredStableChecks = 3; 

        probeRef.current = window.setInterval(() => {
            const combinedRect = getCombinedBoundingBox(stepData.elementIds!);
            if (!combinedRect) {
                stabilityCounter = 0;
                return;
            }

            const currentRectJSON = JSON.stringify(combinedRect);
            if (previousRectJSON === currentRectJSON) {
                stabilityCounter++;
            } else {
                stabilityCounter = 0;
                previousRectJSON = currentRectJSON;
            }

            if (stabilityCounter >= requiredStableChecks) {
                clearProbe();
                setHighlightBox(combinedRect);
                // User feedback: Force the dialog to the top at step 2 to prevent it from covering the collect button.
                if (step === 2) {
                    setDialogPosition('top');
                } else {
                    setDialogPosition(combinedRect.top > window.innerHeight / 2 ? 'top' : 'bottom');
                }
            }
        }, 50);

        return () => clearProbe();
    }, [step, stepData]);

    if (step === 0 || !stepData) {
        return null;
    }

    const dialogClasses = `fixed z-[2002] w-full max-w-md p-4 flex items-start ${dialogPosition === 'top' ? 'top-5' : 'bottom-5'} left-1/2 -translate-x-1/2`;
    const isReadyForHighlight = highlightBox && !stepData.isGlobal;
    const padding = 8;

    return (
        <>
            {/* Unified Overlay */}
            <div
                className="fixed pointer-events-none z-[2000]"
                style={{
                    top: isReadyForHighlight ? highlightBox.top - padding : 0,
                    left: isReadyForHighlight ? highlightBox.left - padding : 0,
                    width: isReadyForHighlight ? highlightBox.width + padding * 2 : '100%',
                    height: isReadyForHighlight ? highlightBox.height + padding * 2 : '100%',
                    boxShadow: isReadyForHighlight ? '0 0 0 100vmax rgba(0,0,0,0.9)' : 'none',
                    backgroundColor: isReadyForHighlight ? 'transparent' : 'rgba(0,0,0,0.9)',
                }}
            />

            {/* Pulsing Highlight Border (only when highlight is active) */}
            {isReadyForHighlight && (
                <div
                    className="fixed z-[2001] border-4 rounded-lg pointer-events-none animate-tutorial-pulse"
                    style={{
                        top: highlightBox.top - padding,
                        left: highlightBox.left - padding,
                        width: highlightBox.width + padding * 2,
                        height: highlightBox.height + padding * 2,
                    }}
                />
            )}
            
            {/* Dialog Box (only when ready) */}
            {(highlightBox || stepData.isGlobal) && (
                <div className={`${dialogClasses} animate-fade-in-fast`}>
                    <AIAvatar />
                    <div className="bg-[var(--bg-popup)] p-3 rounded-lg flex-grow border border-cyan-500/50 shadow-lg">
                        <p className="text-sm min-h-[3em]">{typedText}{charIndex < (stepData.text?.length || 0) && <span className="inline-block w-0.5 h-4 bg-cyan-300 animate-pulse ml-1" />}
                        </p>
                        <div className="flex justify-end mt-3 text-xs space-x-2">
                            <button onClick={handleSkip} className="px-3 py-1 rounded bg-red-800/80 hover:bg-red-700 transition-colors">Passer</button>
                            {charIndex >= (stepData.text?.length || 0) && (
                                 <button onClick={handleNext} className="px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 transition-colors">{!tutorialSteps[step + 1] ? "Terminer" : "Suivant"}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AITutorial;