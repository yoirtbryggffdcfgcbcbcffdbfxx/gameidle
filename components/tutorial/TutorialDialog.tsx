
import React from 'react';

const AIAvatar = () => (
    <div className="relative w-12 h-12 flex-shrink-0 mr-4">
        {/* Cercle rotatif externe */}
        <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full border-t-cyan-400 animate-spin-slow"></div>
        {/* Cercle rotatif interne inverse */}
        <div className="absolute inset-1 border border-cyan-500/20 rounded-full border-b-cyan-300 animate-spin-reverse-slow"></div>
        
        {/* Noyau IA */}
        <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
            <defs>
                <radialGradient id="ai-grad" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#00f5d4" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="15" fill="url(#ai-grad)" />
            <circle cx="50" cy="50" r="5" fill="#fff" />
        </svg>
    </div>
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

    // Positionnement : Plus d'espace sur les bords pour l'effet flottant
    // Ajustement : bottom-6 au lieu de bottom-20 sur mobile pour dégager la vue
    const positionClass = position === 'top' ? 'top-8' : 'bottom-6 md:bottom-8';

    return (
        <div className={`fixed left-0 right-0 ${positionClass} flex justify-center z-[2001] pointer-events-none px-4`}>
            <div className="bg-[#050a10]/90 backdrop-blur-md border-l-4 border-cyan-500 rounded-r-lg shadow-[0_0_30px_rgba(0,245,212,0.15)] p-4 max-w-2xl w-full flex items-start relative overflow-hidden pointer-events-auto animate-slide-in-up border-y border-r border-white/10">
                
                {/* Effet de scan en arrière-plan */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,245,212,0.03)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none"></div>
                
                {/* Décoration tech en haut à droite */}
                <div className="absolute top-0 right-0 p-1">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                        <div className="w-1 h-1 bg-cyan-500/30 rounded-full"></div>
                        <div className="w-1 h-1 bg-cyan-500/10 rounded-full"></div>
                    </div>
                </div>

                <AIAvatar />

                <div className="flex-grow relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Incoming Transmission // AI-CORE</span>
                        <button 
                            onClick={onSkip}
                            className="text-[10px] text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                            [Terminer]
                        </button>
                    </div>
                    
                    <p className="text-sm md:text-base text-gray-200 font-mono leading-relaxed min-h-[3em] shadow-black drop-shadow-md">
                        {text}
                        {!isTypingComplete && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle"></span>}
                    </p>

                    <div className="flex justify-end mt-3 h-8">
                        {isTypingComplete && !hideNextButton && (
                             <button 
                                onClick={onNext} 
                                className="group relative overflow-hidden bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/50 text-cyan-300 px-6 py-1.5 rounded text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLastStep ? "Initialiser" : "Continuer"} 
                                    <span className="transform group-hover:translate-x-1 transition-transform">»</span>
                                </span>
                             </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialDialog;
