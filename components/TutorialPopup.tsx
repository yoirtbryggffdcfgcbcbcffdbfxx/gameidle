import React, { useState, useLayoutEffect } from 'react';

interface TutorialStep {
    elementId?: string;
    elementIds?: string[]; // Support for multiple elements
    text: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    isGlobal?: boolean;
}

const tutorialSteps: { [key: string]: TutorialStep } = {
    '1': { 
        elementId: 'collect-button', 
        text: "Bienvenue ! Le bouton 'Collecter' clignote : cliquez dessus pour générer votre première énergie.", 
        position: 'bottom' 
    },
    '2': { 
        elementIds: ['energy-bar-container', 'collect-button'],
        text: "Super ! C'est votre énergie. Le bouton 'Collecter' clignote encore : cliquez dessus pour gagner assez d'énergie pour la suite.", 
        position: 'bottom' 
    },
    '2.5': {
        elementId: 'mobile-upgrades-tab',
        text: "Parfait ! Maintenant, allez dans l'onglet des améliorations pour acheter votre générateur.",
        position: 'top',
    },
    '3': { 
        elementId: 'upgrade-gen_1', 
        text: "Utilisez votre énergie pour acheter ce générateur. Il produira de l'énergie automatiquement !", 
        position: 'bottom' 
    },
    '4': { 
        isGlobal: true, 
        text: "Parfait ! Vous produisez maintenant de l'énergie passivement. Continuez à débloquer et acheter des améliorations pour devenir plus puissant. Bonne chance !", 
        position: 'center' 
    },
};

interface TutorialOverlayProps {
    step: number;
    setStep: (step: number) => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, setStep }) => {
    const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        const stepData = tutorialSteps[step];
        if (!stepData || stepData.isGlobal) {
            setHighlightBox(null);
            return;
        }

        const calculatePosition = () => {
            const getCombinedRect = (ids: string[]): DOMRect | null => {
                const rects = ids.map(id => document.getElementById(id)?.getBoundingClientRect()).filter(Boolean) as DOMRect[];
                if (rects.length === 0) return null;

                const left = Math.min(...rects.map(r => r.left));
                const top = Math.min(...rects.map(r => r.top));
                const right = Math.max(...rects.map(r => r.right));
                const bottom = Math.max(...rects.map(r => r.bottom));

                return new DOMRect(left, top, right - left, bottom - top);
            };
            
            const targetIds = stepData.elementIds || (stepData.elementId ? [stepData.elementId] : []);
            
            if (targetIds.length > 0) {
                const firstElement = document.getElementById(targetIds[0]);
                
                if (firstElement) {
                    firstElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                }
                
                const combinedRect = getCombinedRect(targetIds);
                setHighlightBox(combinedRect);
            } else {
                setHighlightBox(null);
            }
        };

        // Use a small timeout to let the UI settle, especially after tab switches or animations.
        // This ensures getBoundingClientRect() returns the final, accurate position.
        const timer = setTimeout(calculatePosition, 50);

        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition, true); // Use capture phase for all scroll events

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition, true);
        };
    }, [step]);

    const stepData = tutorialSteps[step];
    if (!stepData) return null;

    const clipPath = highlightBox
        ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${highlightBox.top}px, ${highlightBox.left}px ${highlightBox.top}px, ${highlightBox.left}px ${highlightBox.bottom}px, ${highlightBox.right}px ${highlightBox.bottom}px, ${highlightBox.right}px ${highlightBox.top}px, 0 ${highlightBox.top}px)`
        : 'none';

    const getTooltipPosition = () => {
        if (!highlightBox || !stepData) return { display: 'none' };
        
        const style: React.CSSProperties = {
            position: 'fixed',
            transform: 'translate(-50%, -50%)',
            transition: 'top 0.4s ease, left 0.4s ease, transform 0.4s ease',
        };

        const offset = 20;
        
        switch(stepData.position) {
            case 'top':
                style.top = `${highlightBox.top - offset}px`;
                style.left = `${highlightBox.left + highlightBox.width / 2}px`;
                style.transform = 'translate(-50%, -100%)';
                break;
            case 'bottom':
                style.top = `${highlightBox.bottom + offset}px`;
                style.left = `${highlightBox.left + highlightBox.width / 2}px`;
                style.transform = 'translateX(-50%)';
                break;
            case 'left':
                 style.top = `${highlightBox.top + highlightBox.height / 2}px`;
                 style.left = `${highlightBox.left - offset}px`;
                 style.transform = 'translate(-100%, -50%)';
                 break;
            case 'right':
                style.top = `${highlightBox.top + highlightBox.height / 2}px`;
                style.left = `${highlightBox.right + offset}px`;
                style.transform = 'translateY(-50%)';
                break;
        }
        return style;
    }

    if (stepData.isGlobal) {
         return (
            <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-[2000] p-4 text-center">
                 <div className="bg-[var(--bg-popup)] text-[var(--text-main)] p-4 rounded-lg shadow-2xl border-2 border-cyan-400 max-w-sm animate-popup-scale">
                    <p className="mb-4">{stepData.text}</p>
                    <button onClick={() => setStep(0)} className="bg-blue-600 text-white px-4 py-2 rounded">Commencer !</button>
                 </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[2000] pointer-events-none">
            {/* Overlay with cutout */}
            <div 
                className="fixed inset-0 bg-black/70 pointer-events-none transition-all duration-300"
                style={{ clipPath }}
            />
            {/* Highlight border */}
            {highlightBox && (
                 <div
                    className="fixed rounded-lg border-2 border-dashed border-cyan-400 transition-all duration-300 animate-pulse"
                    style={{ 
                        top: highlightBox.top - 4,
                        left: highlightBox.left - 4,
                        width: highlightBox.width + 8,
                        height: highlightBox.height + 8,
                     }}
                 />
            )}
            {/* Tooltip */}
            {highlightBox && (
                <div 
                    className="bg-[var(--bg-popup)] p-3 rounded-lg text-xs w-64 shadow-xl animate-popup-scale"
                    style={getTooltipPosition()}
                >
                    {stepData.text}
                </div>
            )}
             {/* Skip button */}
            <button 
                onClick={() => setStep(0)} 
                className="fixed top-4 right-4 bg-red-800 text-white px-2 py-1 rounded-md pointer-events-auto text-xs transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
                Passer le tutoriel
            </button>
        </div>
    );
};

export default TutorialOverlay;