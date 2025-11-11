import React, { useState, useLayoutEffect, useMemo } from 'react';
import { tutorialSteps } from '../data/tutorial';
import { useElementBounds } from '../hooks/ui/useElementBounds';
import { useTypedText } from '../hooks/ui/useTypedText';
import TutorialOverlay from './tutorial/TutorialOverlay';
import TutorialDialog from './tutorial/TutorialDialog';

interface AITutorialProps {
    step: number;
    setStep: (step: number) => void;
    scrollToSection: (sectionId: string) => void;
}

const AITutorial: React.FC<AITutorialProps> = ({ step, setStep, scrollToSection }) => {
    const [dialogPosition, setDialogPosition] = useState<'top' | 'bottom'>('bottom');
    const stepData = tutorialSteps[step];

    // Hooks personnalisés pour séparer la logique
    const bounds = useElementBounds(stepData?.elementIds || []);
    const { typedText, isTypingComplete } = useTypedText(stepData?.text || '');

    useLayoutEffect(() => {
        if (bounds) {
            // Décider de la position du dialogue en fonction de la position de la surbrillance
            let newDialogPosition: 'top' | 'bottom' = bounds.top > window.innerHeight / 2 ? 'top' : 'bottom';
            // Permettre au step de forcer une position
            if (stepData?.dialogPosition) {
                newDialogPosition = stepData.dialogPosition;
            }
            setDialogPosition(newDialogPosition);
        }
    }, [bounds, stepData]);

    if (step === 0 || !stepData) {
        return null;
    }

    const handleNext = () => {
        const nextStepIndex = step + 1;
        const nextStepData = tutorialSteps[nextStepIndex];

        if (nextStepData) {
            if (nextStepData.sectionId) {
                scrollToSection(nextStepData.sectionId);
            }
            // Use a small timeout to allow the scroll to begin, preventing a visual glitch
            // where the highlight box might try to render at the old scroll position.
            setTimeout(() => {
                setStep(nextStepIndex);
            }, 200);
        } else {
            // End of tutorial
            setStep(0);
        }
    };
    const handleSkip = () => setStep(0);
    
    // La surbrillance n'est prête que si les limites sont calculées et que l'étape n'est pas globale
    const isHighlightReady = bounds && !stepData.isGlobal;
    // Le dialogue est prêt si l'étape est globale ou si la surbrillance est prête
    const isDialogReady = stepData.isGlobal || isHighlightReady;

    return (
        <>
            <TutorialOverlay
                highlightBox={isHighlightReady ? bounds : null}
                isGlobal={stepData.isGlobal}
            />
            {isDialogReady && (
                <TutorialDialog
                    text={typedText}
                    isTypingComplete={isTypingComplete}
                    position={dialogPosition}
                    hideNextButton={stepData.hideNextButton}
                    isLastStep={!tutorialSteps[step + 1]}
                    onNext={handleNext}
                    onSkip={handleSkip}
                />
            )}
        </>
    );
};

export default AITutorial;