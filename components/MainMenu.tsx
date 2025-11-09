import React, { useMemo } from 'react';
import Logo from './Logo';

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

    const buttonClasses = "w-full text-xl px-4 py-3 rounded-md border-2 transition-all text-white shadow-lg transform hover:scale-105";
    const buttonTextStyle = { textShadow: '0 0 8px #fff, 0 0 12px currentColor' };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2f] flex flex-col justify-center items-center z-[90] text-center p-4 overflow-hidden">
            <button 
                onClick={onCreditsClick}
                onMouseEnter={() => playSfx('ui_hover')}
                className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white shadow-md z-20"
            >
                Crédits
            </button>

            {particles.map(p => <BackgroundParticle key={p.id} style={p.style} />)}
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="scale-75 mb-8">
                    <Logo />
                </div>
               
                <div className="space-y-4 w-full max-w-xs">
                    {hasSaveData && (
                        <button 
                            onClick={onContinue}
                            onMouseEnter={() => playSfx('ui_hover')}
                            className={`${buttonClasses} border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 shadow-cyan-400/30`}
                        >
                            <span style={buttonTextStyle}>Continuer</span>
                        </button>
                    )}
                    <button 
                        onClick={onNewGame}
                        onMouseEnter={() => playSfx('ui_hover')} 
                        className={`${buttonClasses} border-purple-400 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 shadow-purple-400/30`}
                    >
                        <span style={buttonTextStyle}>Nouvelle Partie</span>
                    </button>
                </div>
            </div>
             <p className="absolute bottom-4 text-xs opacity-50 z-10">Version 1.6.0</p>
        </div>
    );
};

export default MainMenu;