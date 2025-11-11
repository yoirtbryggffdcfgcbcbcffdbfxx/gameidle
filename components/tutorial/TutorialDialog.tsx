import React from 'react';

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

interface TutorialDialogProps {
    text: string;
    isTypingComplete: boolean;
    position: 'top' | 'bottom';
    hideNextButton?: boolean;
    isLastStep: boolean;
    onNext: () => void;
    onSkip: () => void;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({
    text,
    isTypingComplete,
    position,
    hideNextButton,
    isLastStep,
    onNext,
    onSkip,
}) => {

    const dialogClasses = `fixed z-[2001] w-full max-w-md p-4 flex items-start ${position === 'top' ? 'top-5' : 'bottom-5'} left-1/2 -translate-x-1/2 animate-fade-in-fast`;

    return (
        <div className={dialogClasses}>
            <AIAvatar />
            <div className="bg-[var(--bg-popup)] p-3 rounded-lg flex-grow border border-cyan-500/50 shadow-lg relative">
                <p className="text-sm min-h-[3em]">
                    {text}
                    {!isTypingComplete && <span className="inline-block w-0.5 h-4 bg-cyan-300 animate-pulse ml-1" />}
                </p>
                <div className="flex justify-end mt-3 text-xs space-x-2">
                    <button onClick={onSkip} className="px-3 py-1 rounded bg-red-800/80 hover:bg-red-700 transition-colors">Passer</button>
                    {isTypingComplete && !hideNextButton && (
                         <button onClick={onNext} className="px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 transition-colors">
                            {isLastStep ? "Terminer" : "Suivant"}
                         </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorialDialog;
