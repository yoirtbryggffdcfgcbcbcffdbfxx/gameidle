import React, { useLayoutEffect, useState, useEffect } from 'react';

interface TutorialStep {
    elementId?: string;
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right';
    isGlobal?: boolean;
}

const tutorialSteps: { [key: number]: TutorialStep } = {
    1: { 
        elementId: 'collect-button', 
        text: "Cliquez ici pour générer votre première énergie.",
        position: 'top',
    },
    2: { 
        elementId: 'collect-button',
        text: "Continuez jusqu'à avoir assez d'énergie pour votre premier générateur (10).", 
        position: 'top',
    },
    3: { 
        elementId: 'nav-forge', 
        text: "Utilisez la navigation pour accéder à la Forge.",
        position: 'left',
    },
    4: {
        elementId: 'upgrade-gen_1',
        text: "Achetez ce générateur pour commencer la production passive.",
        position: 'top',
    },
    5: {
        elementId: 'nav-command-center',
        text: "Bien ! Maintenant, visitez le Centre de Commandement pour voir vos succès.",
        position: 'left',
    },
    6: { 
        isGlobal: true, 
        text: "Vous maîtrisez les bases ! Explorez, améliorez et progressez vers l'Ascension. Bonne chance, Capitaine.",
        position: 'bottom' // Position doesn't matter for global
    },
};

interface TutorialTooltipProps {
    step: number;
    setStep: (step: number) => void;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({ step, setStep }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const stepData = tutorialSteps[step];

    useLayoutEffect(() => {
        if (!stepData || !stepData.elementId) {
            setPosition(null);
            return;
        }
        
        const updatePosition = () => {
            const element = document.getElementById(stepData.elementId!);
            if (element) {
                const rect = element.getBoundingClientRect();
                let newPos = { top: 0, left: 0 };
                switch(stepData.position) {
                    case 'top':
                        newPos = { top: rect.top, left: rect.left + rect.width / 2 };
                        break;
                    case 'bottom':
                        newPos = { top: rect.bottom, left: rect.left + rect.width / 2 };
                        break;
                    case 'left':
                        newPos = { top: rect.top + rect.height / 2, left: rect.left };
                        break;
                    case 'right':
                         newPos = { top: rect.top + rect.height / 2, left: rect.right };
                        break;
                }
                setPosition(newPos);
            }
        };

        // Delay to ensure element is rendered
        const timer = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        };

    }, [step, stepData]);
    
    // Auto-dismiss the final global message
    useEffect(() => {
        if(stepData?.isGlobal) {
            const timer = setTimeout(() => setStep(0), 5000);
            return () => clearTimeout(timer);
        }
    }, [stepData, setStep]);

    if (!stepData || step === 0) return null;

    if (stepData.isGlobal) {
        return (
             <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-[2000] p-4 text-center">
                 <div className="bg-[var(--bg-popup)] text-[var(--text-main)] p-4 rounded-lg shadow-2xl border-2 border-cyan-400 max-w-sm animate-popup-scale">
                    <p className="mb-4">{stepData.text}</p>
                    <button onClick={() => setStep(0)} className="bg-blue-600 text-white px-4 py-2 rounded">Terminer</button>
                 </div>
            </div>
        );
    }
    
    if (!position) return null;

    const tooltipPositions = {
        top: { transform: 'translate(-50%, -120%)' },
        bottom: { transform: 'translate(-50%, 20%)' },
        left: { transform: 'translate(-105%, -50%)' },
        right: { transform: 'translate(5%, -50%)' },
    };

    const arrowPositions = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-popup)]',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-popup)] rotate-180',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-popup)] -rotate-90',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-popup)] rotate-90',
    };

    return (
        <div 
            className="fixed z-[2001] bg-[var(--bg-popup)] p-2 rounded-md shadow-lg border border-cyan-400 text-xs max-w-xs animate-popup-scale"
            style={{ ...position, ...tooltipPositions[stepData.position] }}
        >
            <div className={`absolute w-0 h-0 border-x-8 border-x-transparent border-t-8 ${arrowPositions[stepData.position]}`} />
            {stepData.text}
             <button 
                onClick={() => setStep(0)} 
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
             >
                 X
             </button>
        </div>
    );
};

export default TutorialTooltip;
