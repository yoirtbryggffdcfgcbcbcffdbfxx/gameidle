import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import AIAvatar from '../ui/AIAvatar';

const CoreTutorialTooltip: React.FC = () => {
    const { gameState } = useGameContext();
    
    if (gameState.chosenQuantumPath || gameState.hasInteractedWithQuantumCore) {
        return null;
    }

    return (
        <div className="absolute z-10 w-48 pointer-events-none
                        top-full mt-2 left-1/2 -translate-x-1/2 
                        md:left-full md:ml-4 md:top-1/2 md:-translate-y-1/2 md:translate-x-0
                        animate-fade-in-fast">
            <div className="flex items-center gap-2">
                <AIAvatar className="w-12 h-12 animate-ai-bob" />
                <div className="bg-[var(--bg-popup)] p-2 rounded-lg border border-cyan-500/50 text-xs shadow-lg relative
                                before:content-[''] before:absolute before:w-0 before:h-0
                                before:bottom-full before:left-1/2 before:-translate-x-1/2
                                before:border-l-8 before:border-l-transparent
                                before:border-r-8 before:border-r-transparent
                                before:border-b-8 before:border-b-[var(--bg-popup)]
                                
                                md:before:bottom-auto md:before:left-auto
                                md:before:top-1/2 md:before:-translate-y-1/2 md:before:-left-2
                                md:before:border-l-0 md:before:border-r-8 md:before:border-b-transparent
                                md:before:border-r-[var(--bg-popup)]
                                md:before:border-t-8 md:before:border-t-transparent
                                md:before:border-b-8">
                    <p>Tiens, c'est nouveau. Qu'est-ce qu'il se passe si nous cliquons dessus ?</p>
                </div>
            </div>
        </div>
    );
};

export default CoreTutorialTooltip;
