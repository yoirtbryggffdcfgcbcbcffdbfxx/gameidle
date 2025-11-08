import React, { useMemo } from 'react';

interface MainMenuProps {
    hasSaveData: boolean;
    onContinue: () => void;
    onNewGame: () => void;
    onCreditsClick: () => void;
    playSfx: (sound: 'ui_hover') => void;
}

const BackgroundParticle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="animate-particle-fade" style={style}></div>
);

const MainMenu: React.FC<MainMenuProps> = ({ hasSaveData, onContinue, onNewGame, onCreditsClick, playSfx }) => {
    
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDuration: `${10 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * -25}s`,
            },
        }));
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[var(--bg-from)] to-[var(--bg-to)] flex flex-col justify-center items-center z-[90] text-center p-4 overflow-hidden">
            <button 
                onClick={onCreditsClick}
                onMouseEnter={() => playSfx('ui_hover')}
                className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white shadow-md z-20"
            >
                Crédits
            </button>

            {particles.map(p => <BackgroundParticle key={p.id} style={p.style} />)}
            
            <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl text-[var(--text-header)] mb-16 [text-shadow:2px_2px_#000,0_0_15px_var(--text-header)] animate-float">
                    Quantum Core
                </h1>
                <div className="space-y-4 w-full max-w-xs">
                    {hasSaveData && (
                        <button 
                            onClick={onContinue}
                            onMouseEnter={() => playSfx('ui_hover')}
                            className="w-full text-2xl px-4 py-3 rounded-md bg-green-600 hover:bg-green-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/50"
                        >
                            Continuer
                        </button>
                    )}
                    <button 
                        onClick={onNewGame}
                        onMouseEnter={() => playSfx('ui_hover')} 
                        className="w-full text-2xl px-4 py-3 rounded-md bg-blue-600 hover:bg-blue-500 transition-all text-white shadow-lg transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/50"
                    >
                        Nouvelle Partie
                    </button>
                </div>
            </div>
             <p className="absolute bottom-4 text-xs opacity-50 z-10">Version 1.4.0</p>
        </div>
    );
};

export default MainMenu;